import React, { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import {
  Mail,
  Calendar,
  MessageSquare,
  Trash2,
  CheckCircle,
  RefreshCw,
  Search,
  MoreVertical,
  ArrowLeft,
  User,
} from "lucide-react";
import { useToast } from "../../context/ToastContext";
import ConfirmModal from "../ui/ConfirmModal";

const Contacts = ({ onCountChange }) => {
  const { showToast } = useToast();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    contactId: null,
  });

  // Mobile view state
  const [showMobileList, setShowMobileList] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  async function fetchContacts() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      showToast("Error loading contacts", "error");
    } finally {
      setLoading(false);
    }
  }

  async function markAsRead(id) {
    // Optimistically update local state immediately
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "read" } : c))
    );

    if (selectedContact?.id === id) {
      setSelectedContact((prev) => ({ ...prev, status: "read" }));
    }

    // Refresh unread count in parent immediately based on local state calculation
    // (Or just trigger the parent fetch)
    if (onCountChange) {
      onCountChange();
    }

    try {
      const { error } = await supabase
        .from("contacts")
        .update({ status: "read" })
        .eq("id", id);

      if (error) throw error;
      // No toast message as requested
    } catch (error) {
      console.error("Error updating status:", error);
      // Revert on error if needed, but usually not critical for read status
    }
  }

  async function deleteContact(id) {
    try {
      const { error } = await supabase.from("contacts").delete().eq("id", id);

      if (error) throw error;

      showToast("Message deleted successfully", "success");

      // Remove from local state immediately
      setContacts((prev) => prev.filter((c) => c.id !== id));

      if (selectedContact?.id === id) {
        setSelectedContact(null);
        setShowMobileList(true);
      }

      // Refresh unread count
      if (onCountChange) {
        onCountChange();
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      showToast("Error deleting contact", "error");
    }
  }

  const handleContactClick = (contact) => {
    setSelectedContact(contact);
    setShowMobileList(false);
    if (contact.status === "unread") {
      markAsRead(contact.id);
    }
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: "short" });
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  return (
    <div className="h-[calc(100vh-100px)] bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-700 overflow-hidden flex shadow-sm">
      {/* Left Sidebar - Contact List */}
      <div
        className={`${
          showMobileList ? "flex" : "hidden"
        } md:flex flex-col w-full md:w-[350px] lg:w-[400px] border-r border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900`}
      >
        {/* Sidebar Header */}
        <div className="p-4 bg-gray-50 dark:bg-slate-800/50 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
              Messages
            </h2>
            <button
              onClick={fetchContacts}
              className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors"
              title="Refresh"
            >
              <RefreshCw size={18} />
            </button>
          </div>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No messages found</p>
            </div>
          ) : (
            filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => handleContactClick(contact)}
                className={`group flex items-start gap-3 p-4 cursor-pointer transition-all border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 ${
                  selectedContact?.id === contact.id
                    ? "bg-blue-50 dark:bg-slate-800"
                    : ""
                }`}
              >
                {/* Avatar Placeholder */}
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                  {contact.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3
                      className={`text-sm truncate ${
                        contact.status === "unread"
                          ? "font-bold text-slate-900 dark:text-white"
                          : "font-medium text-slate-700 dark:text-gray-200"
                      }`}
                    >
                      {contact.name}
                    </h3>
                    <span
                      className={`text-xs ${
                        contact.status === "unread"
                          ? "text-primary font-bold"
                          : "text-gray-400"
                      }`}
                    >
                      {formatDate(contact.created_at)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p
                      className={`text-xs truncate max-w-[85%] ${
                        contact.status === "unread"
                          ? "text-slate-800 dark:text-gray-300 font-medium"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {contact.subject}
                    </p>
                    {contact.status === "unread" && (
                      <span className="w-2.5 h-2.5 bg-primary rounded-full"></span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Panel - Message Detail */}
      <div
        className={`${
          !showMobileList ? "flex" : "hidden"
        } md:flex flex-col flex-1 bg-[#efeae2] dark:bg-[#0b141a]`}
      >
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="h-16 px-4 flex items-center justify-between bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 flex-shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowMobileList(true)}
                  className="md:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white font-bold">
                  {selectedContact.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    {selectedContact.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {selectedContact.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors"
                  title="Reply via Email"
                >
                  <Mail size={20} />
                </a>
                <button
                  onClick={() =>
                    setDeleteModal({
                      isOpen: true,
                      contactId: selectedContact.id,
                    })
                  }
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                  title="Delete"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] dark:bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat opacity-95">
              <div className="flex flex-col gap-4 max-w-3xl mx-auto">
                {/* System Message (Date) */}
                <div className="flex justify-center mb-4">
                  <span className="bg-white/90 dark:bg-slate-800/90 text-gray-600 dark:text-gray-300 text-xs px-3 py-1 rounded-lg shadow-sm backdrop-blur-sm">
                    {new Date(selectedContact.created_at).toLocaleDateString(
                      undefined,
                      {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>

                {/* Message Bubble */}
                <div className="self-start max-w-[85%] md:max-w-[70%]">
                  <div className="bg-white dark:bg-slate-800 rounded-lg rounded-tl-none shadow-sm p-4 relative">
                    {/* Triangle */}
                    <div className="absolute top-0 -left-2 w-0 h-0 border-t-[10px] border-t-white dark:border-t-slate-800 border-l-[10px] border-l-transparent"></div>

                    <h4 className="font-bold text-primary text-sm mb-1">
                      {selectedContact.subject}
                    </h4>
                    <p className="text-slate-800 dark:text-gray-200 text-sm whitespace-pre-wrap leading-relaxed">
                      {selectedContact.message}
                    </p>
                    <div className="mt-2 text-right">
                      <span className="text-[10px] text-gray-400">
                        {new Date(
                          selectedContact.created_at
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900 border-b-8 border-primary">
            <div className="w-24 h-24 bg-gray-200 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
              <MessageSquare size={40} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-light text-slate-800 dark:text-white mb-2">
              DevDialect Messages
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md text-center">
              Select a conversation from the sidebar to start reading.
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, contactId: null })}
        onConfirm={() => deleteContact(deleteModal.contactId)}
        title="Delete Message"
        message="Are you sure you want to delete this message? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default Contacts;
