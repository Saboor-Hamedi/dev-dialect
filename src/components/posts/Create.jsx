import React, { useState } from "react";
import { supabase } from "../../supabase";
import { useToast } from "../../context/ToastContext";
import PostForm from "./PostForm";

const Create = (props) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Upload image to Supabase Storage
  const uploadImage = async (imageFile) => {
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

  const handleCreate = async (formData, imageFile) => {
    setLoading(true);

    try {
      // Upload image first if there's a file
      let imageUrl = formData.image_url;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
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

      // Generate slug from title
      const slug = formData.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "") // Remove special characters
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
        .substring(0, 100); // Limit length

      // Add timestamp to ensure uniqueness
      const uniqueSlug = `${slug}-${Date.now()}`;

      // Process tags
      const tagsArray = formData.tags
        ? formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag)
        : [];

      // Insert post with image URL, user_id, and slug
      const postData = {
        title: formData.title.trim(), // Sanitize title
        content: formData.content.trim(), // Sanitize content
        image_url: imageUrl,
        price: formData.price ? parseFloat(formData.price) : null, // Ensure numeric or null
        is_public: Boolean(formData.is_public), // Ensure boolean
        user_id: session.user.id, // Security: Use session user ID
        slug: uniqueSlug, // Add generated slug
        tags: tagsArray,
        demo_url: formData.demo_url ? formData.demo_url.trim() : null,
        repo_url: formData.repo_url ? formData.repo_url.trim() : null,
        is_featured: Boolean(formData.is_featured),
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
    <PostForm
      onSubmit={handleCreate}
      onCancel={props.onCancel}
      submitLabel="Create Post"
      loading={loading}
      uploading={uploading}
    />
  );
};

export default Create;
