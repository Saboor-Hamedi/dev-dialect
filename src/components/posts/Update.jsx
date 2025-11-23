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

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image_url: "",
    price: "",
    is_public: false,
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
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", postId)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          title: data.title || "",
          content: data.content || "",
          image_url: data.image_url || "",
          price: data.price || "",
          is_public: data.is_public || false,
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
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
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
    setLoading(true);

    try {
      // Upload image first if there's a new file
      let imageUrl = formData.image_url;
      if (imageFile) {
        imageUrl = await uploadImage();
        if (!imageUrl) {
          setLoading(false);
          return; // Stop if upload failed
        }
      }

      // Update post with image URL
      const postData = {
        ...formData,
        image_url: imageUrl,
      };

      const { error } = await supabase
        .from("posts")
        .update(postData)
        .eq("id", postId);

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

  if (fetchingPost) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header - Compact design */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            Update Post
          </h1>
          <p className="text-gray-500 mt-0.5 text-sm">
            Edit your project or article
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
              Title
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="e.g., Modern React Dashboard"
            />
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
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-green-600 file:cursor-pointer"
                />
              </div>
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
              Content / Description{" "}
              <span className="text-xs text-gray-500">
                (Markdown supported)
              </span>
            </label>
            <textarea
              name="content"
              rows="6"
              required
              value={formData.content}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none font-mono text-sm"
              placeholder="Describe your project... (Markdown supported: # Heading, **bold**, `code`, etc.)"
            />
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
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="e.g., $29.99 or Free"
              />
            </div>

            {/* Category */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="e.g., Web Development"
              />
            </div> */}
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
