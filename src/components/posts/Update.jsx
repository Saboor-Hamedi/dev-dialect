import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import { useNavigate, useParams } from "react-router-dom";
import { Save, ArrowLeft, Image as ImageIcon, X } from "lucide-react";
import { useToast } from "../../context/ToastContext";

const Update = (props) => {
  const { postId } = props; // Get post ID from props instead of URL
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [fetchingPost, setFetchingPost] = useState(true);

  // Validation state
  const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image_url: "",
    price: "",
    is_public: false,
    tags: "",
    demo_url: "",
    repo_url: "",
    is_featured: false,
  });

  // Fetch existing post data
  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  async function fetchPost() {
    setFetchingPost(true);
    try {
      // Get current user session for security check
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        showToast("You must be logged in to edit posts", "error");
        setFetchingPost(false);
        return;
      }

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", postId)
        .eq("user_id", session.user.id) // Security: Only fetch posts owned by current user
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          title: data.title || "",
          content: data.content || "",
          image_url: data.image_url || "",
          price: data.price || "",
          is_public: data.is_public || false,
          tags: data.tags ? data.tags.join(", ") : "",
          demo_url: data.demo_url || "",
          repo_url: data.repo_url || "",
          is_featured: data.is_featured || false,
        });
        // Set image preview if there's an existing image
        if (data.image_url) {
          setImagePreview(data.image_url);
        }
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      showToast("Error loading post: " + error.message, "error");
    } finally {
      setFetchingPost(false);
    }
  }

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
      const filePath = `update/${fileName}`;

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
      // Get current user session for security check
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        showToast("You must be logged in to update posts", "error");
        setLoading(false);
        return;
      }

      // Upload image first if there's a new file
      let imageUrl = formData.image_url;
      if (imageFile) {
        imageUrl = await uploadImage();
        if (!imageUrl) {
          setLoading(false);
          return; // Stop if upload failed
        }
      }

      // Process tags
      const tagsArray = formData.tags
        ? formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag)
        : [];

      // Sanitize and prepare update data
      const postData = {
        title: formData.title.trim(), // Sanitize title
        content: formData.content.trim(), // Sanitize content
        image_url: imageUrl,
        price: formData.price ? parseFloat(formData.price) : null, // Ensure numeric or null
        is_public: Boolean(formData.is_public), // Ensure boolean
        tags: tagsArray,
        demo_url: formData.demo_url ? formData.demo_url.trim() : null,
        repo_url: formData.repo_url ? formData.repo_url.trim() : null,
        is_featured: Boolean(formData.is_featured),
      };

      const { error } = await supabase
        .from("posts")
        .update(postData)
        .eq("id", postId)
        .eq("user_id", session.user.id); // Security: Only update posts owned by current user

      if (error) throw error;

      showToast("Post updated successfully!", "success");
      // Navigate back or call callback
      if (props.onSuccess) {
        props.onSuccess();
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      showToast("Error updating post: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // ... (render logic)

  return (
    <div className="max-w-3xl mx-auto">
      {/* ... (header) */}

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-5 md:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ... (Title, Image, Content fields remain same) */}

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

            {/* Tech Stack */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tech Stack (Comma separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="React, Node.js, Supabase"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Demo URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Live Demo URL
              </label>
              <input
                type="url"
                name="demo_url"
                value={formData.demo_url}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="https://example.com"
              />
            </div>

            {/* Repo URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                GitHub Repo URL
              </label>
              <input
                type="url"
                name="repo_url"
                value={formData.repo_url}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="https://github.com/username/repo"
              />
            </div>
          </div>

          {/* Visibility & Featured Toggles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                Make Public
              </label>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-slate-700/30 rounded-lg border border-gray-100 dark:border-slate-700">
              <input
                type="checkbox"
                id="is_featured"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
                className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary"
              />
              <label
                htmlFor="is_featured"
                className="text-sm font-medium text-slate-700 dark:text-gray-200 cursor-pointer select-none"
              >
                Feature this Project
              </label>
            </div>
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
                ? "Updating..."
                : "Update Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Update;
