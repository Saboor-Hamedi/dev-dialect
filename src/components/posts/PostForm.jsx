import React, { useState, useEffect, useRef } from "react";
import {
  Save,
  X,
  Image as ImageIcon,
  Eye,
  EyeOff,
  Bold,
  Italic,
  Code,
  Link as LinkIcon,
  List,
  ListOrdered,
  Heading,
  Upload,
  Maximize2,
  Minimize2,
} from "lucide-react";
import { supabase } from "../../supabase";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeBlock from "../ui/CodeBlock";

const PostForm = ({
  initialData = {},
  onSubmit,
  onCancel,
  submitLabel = "Save",
  loading = false,
  uploading = false,
}) => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(initialData.image_url || "");
  const [formErrors, setFormErrors] = useState({});
  const [showPreview, setShowPreview] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [uploadingContent, setUploadingContent] = useState(false);
  const [contentImages, setContentImages] = useState([]);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const previewRef = useRef(null);

  const [formData, setFormData] = useState({
    title: initialData.title || "",
    content: initialData.content || "",
    image_url: initialData.image_url || "",
    price: initialData.price || "",
    is_public: initialData.is_public || false,
    tags: initialData.tags || "",
    demo_url: initialData.demo_url || "",
    repo_url: initialData.repo_url || "",
    is_featured: initialData.is_featured || false,
  });

  // Synchronized scrolling between editor and preview
  const handleEditorScroll = () => {
    if (textareaRef.current && previewRef.current) {
      const textarea = textareaRef.current;
      const preview = previewRef.current;

      // Calculate scroll percentage
      const scrollPercentage =
        textarea.scrollTop / (textarea.scrollHeight - textarea.clientHeight);

      // Apply to preview
      const previewScrollTop =
        scrollPercentage * (preview.scrollHeight - preview.clientHeight);
      preview.scrollTop = previewScrollTop;
    }
  };

  useEffect(() => {
    if (initialData.image_url) {
      setImagePreview(initialData.image_url);
    }
    setFormData((prev) => ({
      ...prev,
      ...initialData,
      tags: Array.isArray(initialData.tags)
        ? initialData.tags.join(", ")
        : initialData.tags || "",
    }));
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Title is required";
    if (!formData.content.trim()) errors.content = "Content is required";

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
      const maxSize = 5 * 1024 * 1024;
      if (imageFile.size > maxSize) {
        errors.image = "Image must be smaller than 5MB.";
      }
    }

    return errors;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      const maxSize = 5 * 1024 * 1024;

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

      setFormErrors((prev) => ({ ...prev, image: undefined }));
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to Supabase and insert into content
  const uploadContentImage = async (file) => {
    if (!file) return null;

    setUploadingContent(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()
        .toString(36)
        .substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `content/${fileName}`;

      const { data, error } = await supabase.storage
        .from("images")
        .upload(filePath, file);

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("images").getPublicUrl(filePath);

      setUploadingContent(false);
      return publicUrl;
    } catch (error) {
      console.error("Error uploading content image:", error);
      setUploadingContent(false);
      return null;
    }
  };

  // Handle image insertion into markdown
  const handleContentImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = await uploadContentImage(file);
      if (imageUrl) {
        insertMarkdown(`![Image](${imageUrl})`);
        setContentImages((prev) => [...prev, imageUrl]);
      }
    }
  };

  // Handle paste event for images
  const handlePaste = async (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        e.preventDefault();
        const file = items[i].getAsFile();
        if (file) {
          const imageUrl = await uploadContentImage(file);
          if (imageUrl) {
            insertMarkdown(`![Pasted Image](${imageUrl})`);
            setContentImages((prev) => [...prev, imageUrl]);
          }
        }
      }
    }
  };

  // Insert markdown at cursor position
  const insertMarkdown = (markdown, wrap = false) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = formData.content;
    const selectedText = text.substring(start, end);

    let newText;
    let newCursorPos;

    if (wrap && selectedText) {
      // Wrap selected text (e.g., **bold**)
      const prefix = markdown.split("TEXT")[0];
      const suffix = markdown.split("TEXT")[1] || prefix; // Handle symmetric wrappers
      newText =
        text.substring(0, start) +
        prefix +
        selectedText +
        suffix +
        text.substring(end);
      newCursorPos = end + prefix.length + suffix.length;
    } else {
      // Insert at cursor
      const insertText = markdown.replace("TEXT", "");
      newText = text.substring(0, start) + insertText + text.substring(end);
      newCursorPos = start + insertText.length;
    }

    setFormData((prev) => ({ ...prev, content: newText }));

    // Restore cursor position and focus
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const markdownActions = [
    {
      icon: Bold,
      label: "Bold",
      action: () => insertMarkdown("**TEXT**", true),
    },
    {
      icon: Italic,
      label: "Italic",
      action: () => insertMarkdown("*TEXT*", true),
    },
    {
      icon: Code,
      label: "Code",
      action: () => insertMarkdown("`TEXT`", true),
    },
    {
      icon: Heading,
      label: "Heading",
      action: () => insertMarkdown("## Heading\n"),
    },
    {
      icon: List,
      label: "Bullet List",
      action: () => insertMarkdown("- Item\n"),
    },
    {
      icon: ListOrdered,
      label: "Numbered List",
      action: () => insertMarkdown("1. Item\n"),
    },
    {
      icon: LinkIcon,
      label: "Link",
      action: () => insertMarkdown("[Link Text](https://example.com)", true),
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    onSubmit(formData, imageFile);
  };

  return (
    <div
      className={`bg-white dark:bg-slate-800 transition-all duration-300 ${
        isFullscreen
          ? "fixed inset-0 z-50 flex flex-col"
          : "rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 relative"
      }`}
    >
      {/* Header / Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 z-10">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white hidden sm:block">
            {initialData.id ? "Edit Post" : "Create Post"}
          </h2>
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-700 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className={`p-1.5 rounded-md text-sm font-medium transition-all ${
                !showPreview
                  ? "bg-white dark:bg-slate-600 text-primary shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Editor
            </button>
            <button
              type="button"
              onClick={() => setShowPreview(true)}
              className={`p-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${
                showPreview
                  ? "bg-white dark:bg-slate-600 text-primary shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Eye size={14} />
              <span className="hidden sm:inline">Preview</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors hidden sm:block"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
          <div className="h-6 w-px bg-gray-200 dark:bg-slate-700 mx-1 hidden sm:block"></div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || uploading || uploadingContent}
              className="bg-primary hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
            >
              <Save size={16} />
              <span className="hidden sm:inline">
                {uploading || uploadingContent
                  ? "Uploading..."
                  : loading
                  ? "Saving..."
                  : submitLabel}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`${
          isFullscreen ? "h-[calc(100vh-73px)]" : "h-[calc(100vh-200px)]"
        } overflow-hidden`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 h-full">
          {/* Editor Panel - Scrollable */}
          <div
            className={`${
              showPreview ? "hidden lg:block" : "block"
            } h-full overflow-y-auto border-r border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900`}
          >
            <div className="p-4 lg:p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    formErrors.title
                      ? "border-red-500"
                      : "border-gray-300 dark:border-slate-600"
                  } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-lg font-semibold`}
                  placeholder="e.g., Modern React Dashboard"
                />
                {formErrors.title && (
                  <p className="mt-1 text-xs text-red-500">
                    {formErrors.title}
                  </p>
                )}
              </div>

              {/* Banner Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Banner Image
                </label>
                <div className="flex flex-col gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      formErrors.image
                        ? "border-red-500"
                        : "border-gray-300 dark:border-slate-600"
                    } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-green-600 file:cursor-pointer`}
                  />
                  {formErrors.image && (
                    <p className="text-xs text-red-500">{formErrors.image}</p>
                  )}
                  {imagePreview && (
                    <div className="relative w-full h-40 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
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
                          setFormErrors((prev) => ({
                            ...prev,
                            image: undefined,
                          }));
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Markdown Editor */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingContent}
                    className="flex items-center gap-1.5 text-xs text-primary hover:text-green-600 font-medium transition-colors disabled:opacity-50"
                  >
                    <Upload size={14} />
                    {uploadingContent ? "Uploading..." : "Insert Image"}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleContentImageUpload}
                    className="hidden"
                  />
                </div>

                {/* Markdown Toolbar */}
                <div className="flex flex-wrap gap-1 mb-2 p-2 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
                  {markdownActions.map((action, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={action.action}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded transition-colors"
                      title={action.label}
                    >
                      <action.icon size={16} />
                    </button>
                  ))}
                </div>

                <textarea
                  ref={textareaRef}
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  onPaste={handlePaste}
                  onScroll={handleEditorScroll}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    formErrors.content
                      ? "border-red-500"
                      : "border-gray-300 dark:border-slate-600"
                  } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-y font-mono text-sm ${
                    isFullscreen ? "min-h-[calc(100vh-450px)]" : "min-h-96"
                  }`}
                  placeholder="Write your content here... (Markdown supported)&#10;&#10;**Bold** *Italic* `Code`&#10;# Heading&#10;- List&#10;[Link](url)&#10;![Image](url)&#10;&#10;Paste images directly or use the Insert Image button!"
                />
                {formErrors.content && (
                  <p className="mt-1 text-xs text-red-500">
                    {formErrors.content}
                  </p>
                )}
              </div>

              {/* Additional Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Price (Optional)
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className={`w-full px-4 py-2.5 rounded-lg border ${
                      formErrors.price
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 dark:border-slate-600 focus:ring-primary"
                    } bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:border-transparent outline-none transition-all`}
                    placeholder="e.g., 29.99"
                  />
                  {formErrors.price && (
                    <p className="mt-1 text-xs text-red-500">
                      {formErrors.price}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tech Stack (Comma separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="React, Node.js, Supabase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    name="demo_url"
                    value={formData.demo_url}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    GitHub Repo URL
                  </label>
                  <input
                    type="url"
                    name="repo_url"
                    value={formData.repo_url}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
                    placeholder="https://github.com/username/repo"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3.5 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    id="is_public"
                    name="is_public"
                    checked={formData.is_public}
                    onChange={handleChange}
                    className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer"
                  />
                  <label
                    htmlFor="is_public"
                    className="text-sm font-medium text-slate-700 dark:text-gray-200 cursor-pointer select-none flex-1"
                  >
                    Make Public
                  </label>
                </div>

                <div className="flex items-center gap-3 p-3.5 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-primary dark:hover:border-primary transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    id="is_featured"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleChange}
                    className="w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary cursor-pointer"
                  />
                  <label
                    htmlFor="is_featured"
                    className="text-sm font-medium text-slate-700 dark:text-gray-200 cursor-pointer select-none flex-1"
                  >
                    Feature this Project
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div
            ref={previewRef}
            className={`${
              showPreview ? "block" : "hidden lg:block"
            } h-full overflow-y-auto bg-white dark:bg-slate-800`}
          >
            <div className="p-4 lg:p-6">
              <div className="mb-4 pb-4 border-b border-gray-200 dark:border-slate-700">
                <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Live Preview
                </h2>
                {imagePreview && (
                  <div className="w-full h-40 rounded-lg overflow-hidden mb-4 bg-gray-100">
                    <img
                      src={imagePreview}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  {formData.title || "Untitled Post"}
                </h1>
                {formData.tags && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.tags.split(",").map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-a:text-primary hover:prose-a:text-green-600 prose-img:rounded-xl prose-img:shadow-md prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none">
                {formData.content ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code: ({
                        node,
                        inline,
                        className,
                        children,
                        ...props
                      }) => {
                        // Check if it's inline:
                        // 1. Explicit inline prop
                        // 2. OR no language class AND no newlines (heuristic for simple inline code)
                        const match = /language-(\w+)/.exec(className || "");
                        const isInline =
                          inline ||
                          (!match && !String(children).includes("\n"));

                        if (isInline) {
                          return (
                            <code
                              className="text-primary bg-primary/10 px-1.5 py-0.5 rounded font-mono text-sm"
                              {...props}
                            >
                              {children}
                            </code>
                          );
                        }
                        // Code blocks (triple backticks)
                        return (
                          <CodeBlock
                            node={node}
                            inline={inline}
                            className={className}
                            {...props}
                          >
                            {children}
                          </CodeBlock>
                        );
                      },
                      pre: ({ children }) => <>{children}</>,
                      p: ({ children, node }) => {
                        if (
                          node?.children?.some(
                            (child) => child.tagName === "code"
                          )
                        ) {
                          return <div>{children}</div>;
                        }
                        return <p>{children}</p>;
                      },
                    }}
                  >
                    {formData.content}
                  </ReactMarkdown>
                ) : (
                  <p className="text-gray-400 italic">
                    Start writing to see the preview...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostForm;
