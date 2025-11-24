import React, { useState, useEffect } from "react";
import { supabase } from "../../supabase";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import PostForm from "./PostForm";
import { Skeleton } from "../ui/Skeleton";

const Update = (props) => {
  const { slug } = useParams();
  const postId = props.postId; // Keep prop support if needed
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fetchingPost, setFetchingPost] = useState(true);
  const [initialData, setInitialData] = useState({});

  // Fetch existing post data
  useEffect(() => {
    if (postId || slug) {
      fetchPost();
    }
  }, [postId, slug]);

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

      let query = supabase
        .from("posts")
        .select("*")
        .eq("user_id", session.user.id); // Security: Only fetch posts owned by current user

      if (postId) {
        query = query.eq("id", postId);
      } else if (slug) {
        query = query.eq("slug", slug);
      }

      const { data, error } = await query.single();

      if (error) throw error;

      if (data) {
        setInitialData({
          id: data.id,
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
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      showToast("Error loading post: " + error.message, "error");
    } finally {
      setFetchingPost(false);
    }
  }

  // Upload image to Supabase Storage
  const uploadImage = async (imageFile) => {
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

  const handleUpdate = async (formData, imageFile) => {
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
        imageUrl = await uploadImage(imageFile);
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
        .eq("id", initialData.id)
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

  if (fetchingPost) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Skeleton className="w-1/3 h-8 mb-6" />
        <Skeleton className="w-full h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <PostForm
      initialData={initialData}
      onSubmit={handleUpdate}
      onCancel={() =>
        props.onCancel ? props.onCancel() : navigate("/dashboard")
      }
      submitLabel="Update Post"
      loading={loading}
      uploading={uploading}
    />
  );
};

export default Update;
