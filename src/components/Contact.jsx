import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { useToast } from "../context/ToastContext";
import { supabase } from "../supabase";

const Contact = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const MAX_MESSAGE_LENGTH = 150;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "message") {
      // Strict length check
      if (value.length <= MAX_MESSAGE_LENGTH) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePaste = (e) => {
    if (e.target.name === "message") {
      e.preventDefault();
      const pastedText = e.clipboardData.getData("text");
      const currentText = formData.message;
      const remainingChars = MAX_MESSAGE_LENGTH - currentText.length;

      if (remainingChars > 0) {
        const textToInsert = pastedText.slice(0, remainingChars);
        const newValue = currentText + textToInsert;
        setFormData({ ...formData, message: newValue });
      }
    }
  };

  const sanitizeInput = (input) => {
    // Basic sanitization to prevent XSS and other injections
    return input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
      .trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate length one last time
      if (formData.message.length > MAX_MESSAGE_LENGTH) {
        throw new Error(
          `Message must be ${MAX_MESSAGE_LENGTH} characters or less.`
        );
      }

      // Sanitize inputs
      const sanitizedData = {
        name: sanitizeInput(formData.name),
        email: sanitizeInput(formData.email),
        subject: sanitizeInput(formData.subject),
        message: sanitizeInput(formData.message),
      };

      // Insert contact message into database
      const { error } = await supabase.from("contacts").insert([
        {
          name: sanitizedData.name,
          email: sanitizedData.email,
          subject: sanitizedData.subject,
          message: sanitizedData.message,
          status: "unread",
        },
      ]);

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      setSubmitted(true);
      showToast("Message sent successfully!", "success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      showToast(
        error.message || "Failed to send message. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 pt-20 pb-12">
      {/* Hero Section */}
      <div className="relative bg-primary/5 dark:bg-primary/10 py-20 mb-16 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4 border border-primary/20">
            Get in Touch
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6">
            Let's Start a <span className="text-primary">Conversation</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Have a project in mind or just want to say hi? We'd love to hear
            from you. Fill out the form below and we'll get back to you shortly.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                <Mail size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Email Us
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Our friendly team is here to help.
              </p>
              <a
                href="mailto:hello@devdialect.com"
                className="text-primary font-semibold hover:underline"
              >
                hello@devdialect.com
              </a>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 mb-6">
                <MapPin size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Office
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Come say hello at our office HQ.
              </p>
              <p className="text-slate-700 dark:text-gray-300 font-medium">
                100 Smith Street
                <br />
                Collingwood VIC 3066 AU
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center text-orange-600 mb-6">
                <Phone size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Phone
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Mon-Fri from 8am to 5pm.
              </p>
              <a
                href="tel:+1555000000"
                className="text-primary font-semibold hover:underline"
              >
                +1 (555) 000-0000
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 p-8 md:p-10">
              {submitted ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6">
                    <CheckCircle size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    Message Sent!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                    Thank you for reaching out. We've received your message and
                    will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                        Your Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        maxLength={100}
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        maxLength={100}
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      required
                      maxLength={100}
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-gray-300">
                        Message
                      </label>
                      <span
                        className={`text-xs font-semibold ${
                          formData.message.length >= MAX_MESSAGE_LENGTH
                            ? "text-red-500"
                            : "text-gray-400"
                        }`}
                      >
                        {formData.message.length}/{MAX_MESSAGE_LENGTH}
                      </span>
                    </div>
                    <textarea
                      name="message"
                      rows="6"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      onPaste={handlePaste}
                      maxLength={MAX_MESSAGE_LENGTH}
                      className={`w-full px-4 py-3 rounded-xl border bg-gray-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none ${
                        formData.message.length >= MAX_MESSAGE_LENGTH
                          ? "border-red-300 dark:border-red-800 focus:ring-red-500"
                          : "border-gray-200 dark:border-slate-600"
                      }`}
                      placeholder="Tell us about your project..."
                    ></textarea>
                    {formData.message.length >= MAX_MESSAGE_LENGTH && (
                      <p className="text-red-500 text-xs mt-1 font-medium animate-pulse">
                        Maximum character limit reached!
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-primary hover:bg-green-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>Sending...</>
                    ) : (
                      <>
                        Send Message <Send size={20} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
