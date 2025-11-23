import React, { useState } from "react";
import { supabase } from "../../supabase";
import { useNavigate } from "react-router-dom";
import { Save, ArrowLeft, Image as ImageIcon, X } from "lucide-react";
import { useToast } from "../../context/ToastContext";

const Create = (props) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Validation state
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image_url: "",
    price: "",
    is_public: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Validate form fields
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.content.trim()) errors.content = "Content is required";

    // Price validation: allow empty (optional), but if present must be a number
    if (formData.price && isNaN(Number(formData.price))) {
      errors.price = "Price must be a valid number";
    }

    if (imageFile) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      if (!allowedTypes.includes(imageFile.type)) {
        errors.image = "Unsupported image type. Use JPEG, PNG, WebP, or GIF.";
      }
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (imageFile.size > maxSize) {
        errors.image = "Image must be smaller than 5MB.";
      }
    }

    return errors;
  };

  // Handle image file selection with validation
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate immediately on selection
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        setFormErrors((prev) => ({
          ...prev,
          image: "Unsupported image type. Use JPEG, PNG, WebP, or GIF.",
        }));
        return;
      }

      if (file.size > maxSize) {
        setFormErrors((prev) => ({
          ...prev,
          image: "Image must be smaller than 5MB.",
        }));
        return;
      }

      // Clear previous image errors
      setFormErrors((prev) => ({ ...prev, image: undefined }));

      setImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to Supabase Storage
  const uploadImage = async () => {
    if (!imageFile) return null;

    setUploading(true);
    try {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Math.random()
        .toString(36)
        .substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `posts/${fileName}`;

      const { data, error } = await supabase.storage
        .from("images") // Make sure this bucket exists in Supabase
        .upload(filePath, imageFile);

      if (error) throw error;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("images").getPublicUrl(filePath);

      setUploading(false);
      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      showToast("Error uploading image: " + error.message, "error");
      setUploading(false);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run validation
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setLoading(true);

    try {
      // Upload image first if there's a file
      let imageUrl = formData.image_url;
      if (imageFile) {
        imageUrl = await uploadImage();
        if (!imageUrl) {
          setLoading(false);
          return; // Stop if upload failed
        }
      }

      // Get current user session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        showToast("You must be logged in to create a post", "error");
        setLoading(false);
        return;
      }

      // Insert post with image URL and user_id
      const postData = {
        ...formData,
        image_url: imageUrl,
        user_id: session.user.id,
      };

      const { error } = await supabase.from("posts").insert([postData]);

      if (error) throw error;

      showToast("Post created successfully!", "success");
      // Call onSuccess callback to switch back to posts view
      if (props.onSuccess) {
        props.onSuccess();
      }
    } catch (error) {
      console.error("Error creating post:", error);
      showToast("Error creating post: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header - Compact design */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            Create New Post
          </h1>
          <p className="text-gray-500 mt-0.5 text-sm">
            Add a new project or article to your projects
          </p>
        </div>
        <button
          onClick={() => props.onCancel && props.onCancel()}
          className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-primary transition-colors text-sm"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      {/* Form Container - Reduced padding for compact design */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-5 md:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                formErrors.title
                  ? "border-red-500"
                  : "border-gray-300 dark:border-slate-600"
              } bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all`}
              placeholder="e.g., Modern React Dashboard"
            />
            {formErrors.title && (
              <p className="mt-1 text-xs text-red-500">{formErrors.title}</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Image
            </label>
            <div className="flex flex-col gap-4">
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    formErrors.image
                      ? "border-red-500"
                      : "border-gray-300 dark:border-slate-600"
                  } bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-green-600 file:cursor-pointer`}
                />
              </div>
              {formErrors.image && (
                <p className="mt-1 text-xs text-red-500">{formErrors.image}</p>
              )}
              {imagePreview && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview("");
                      setFormErrors((prev) => ({ ...prev, image: undefined }));
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content / Description <span className="text-red-500">*</span>{" "}
              <span className="text-xs text-gray-500">
                (Markdown supported)
              </span>
            </label>
            <textarea
              name="content"
              rows="6"
              value={formData.content}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                formErrors.content
                  ? "border-red-500"
                  : "border-gray-300 dark:border-slate-600"
              } bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none font-mono text-sm`}
              placeholder="Describe your project... (Markdown supported: # Heading, **bold**, `code`, etc.)"
            />
            {formErrors.content && (
              <p className="mt-1 text-xs text-red-500">{formErrors.content}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price (Optional)
              </label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg border ${
                  formErrors.price
                    ? "border-red-500"
                    : "border-gray-300 dark:border-slate-600"
                } bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all`}
                placeholder="e.g., 29.99"
              />
              {formErrors.price && (
                <p className="mt-1 text-xs text-red-500">{formErrors.price}</p>
              )}
            </div>
          </div>

          {/* Visibility Toggle */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-700/30 rounded-lg border border-gray-100 dark:border-slate-700">
            <input
              type="checkbox"
              id="is_public"
              name="is_public"
              checked={formData.is_public}
              onChange={handleChange}
              className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
            />
            <label
              htmlFor="is_public"
              className="text-sm font-medium text-slate-700 dark:text-gray-200 cursor-pointer select-none"
            >
              Make this post public immediately
            </label>
          </div>

          {/* Submit Button - Smaller size */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading || uploading}
              className="bg-primary hover:bg-green-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              <Save size={16} />
              {uploading
                ? "Uploading image..."
                : loading
                ? "Creating..."
                : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Create;
