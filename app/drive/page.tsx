"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import "./drive.css";

interface S3Item {
  key: string;
  name: string;
  type: 'file' | 'folder';
  lastModified?: string;
  size?: number;
  url: string;
}

export default function DrivePage() {
  const [items, setItems] = useState<S3Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [prefix, setPrefix] = useState("inventory/images/");
  const [search, setSearch] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  
  // Modals
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [targetPrefix, setTargetPrefix] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchItems = useCallback(async (targetPrefix: string, searchStr?: string) => {
    setLoading(true);
    try {
      const url = new URL("/api/drive", window.location.origin);
      url.searchParams.set("prefix", targetPrefix);
      if (searchStr) url.searchParams.set("search", searchStr);
      url.searchParams.set("limit", "100");

      const res = await fetch(url.toString());
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setItems(data.items);
      setNextCursor(data.nextCursor || null);
    } catch (err: any) {
      showNotification(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchItems(prefix, search);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [search, prefix, fetchItems]);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("prefix", prefix);

    try {
      const res = await fetch("/api/drive?action=upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      showNotification("Upload successful!");
      fetchItems(prefix);
    } catch (err: any) {
      showNotification(err.message, 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const createFolder = async () => {
    if (!newFolderName) return;
    try {
      const res = await fetch("/api/drive?action=create-folder", {
        method: "POST",
        body: JSON.stringify({ name: newFolderName, prefix }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      showNotification("Folder created!");
      setIsFolderModalOpen(false);
      setNewFolderName("");
      fetchItems(prefix);
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  const bulkDelete = async () => {
    if (!confirm(`Delete ${selectedKeys.length} items permanently?`)) return;
    try {
      const res = await fetch("/api/drive?action=bulk-delete", {
        method: "POST",
        body: JSON.stringify({ keys: selectedKeys }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      showNotification("Items deleted!");
      setSelectedKeys([]);
      fetchItems(prefix);
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  const bulkMove = async () => {
    const destination = prompt("Enter target prefix (e.g. inventory/images/product-a/):", prefix);
    if (!destination) return;

    try {
      const res = await fetch("/api/drive?action=bulk-move", {
        method: "POST",
        body: JSON.stringify({ keys: selectedKeys, targetPrefix: destination }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      showNotification("Items moved!");
      setSelectedKeys([]);
      fetchItems(prefix);
    } catch (err: any) {
      showNotification(err.message, 'error');
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    showNotification("URL copied!");
  };

  const toggleSelect = (key: string) => {
    setSelectedKeys(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const renderBreadcrumbs = () => {
    const parts = prefix.split("/").filter(Boolean);
    let currentPath = "";
    return (
      <div className="drive-breadcrumbs">
        <span className="breadcrumb-item" onClick={() => setPrefix("inventory/images/")}>Drive</span>
        {parts.map((part, i) => {
          if (part === "inventory" || part === "images") return null;
          currentPath += part + "/";
          const fullPath = `inventory/images/${currentPath}`;
          return (
            <React.Fragment key={i}>
              <span className="breadcrumb-sep">/</span>
              <span className="breadcrumb-item" onClick={() => setPrefix(fullPath)}>{part}</span>
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <div className="drive-page-wrapper">
      <aside className="drive-sidebar">
        <div className="logo-container" style={{ padding: '0 16px', marginBottom: '12px' }}>
             <span className="logo-text" style={{ fontSize: '16px' }}>Satyam Trders</span>
             <p className="logo-subtext" style={{ fontSize: '7px' }}>Lifestyle Drive</p>
        </div>

        <nav className="sidebar-nav">
          <div className={`nav-item ${prefix === "inventory/images/" ? "active" : ""}`} onClick={() => setPrefix("inventory/images/")}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            All Products
          </div>
          <div className="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            Starred
          </div>
          <div className="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Recent
          </div>
          <div className="nav-item" style={{ marginTop: 'auto', color: '#ff4d4d' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            Trash
          </div>
        </nav>
      </aside>

      <main className="drive-main">
        <header className="drive-top-bar">
          <div className="search-drive">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input 
               placeholder="Search files by SKU or Name..." 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="v-add-to-cart-btn" style={{ width: 'auto', padding: '10px 20px' }} onClick={() => setIsFolderModalOpen(true)}>
              + New Folder
            </button>
            <input type="file" ref={fileInputRef} onChange={handleUpload} style={{ display: 'none' }} />
            <button className="upload-btn" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              {uploading ? "Uploading..." : "↑ Upload"}
            </button>
          </div>
        </header>

        {renderBreadcrumbs()}

        <div className="drive-content">
          {loading ? (
            <div className="loader-container"><div className="gold-spinner"></div></div>
          ) : (
            <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}>
              {items.map((item) => (
                <div 
                  key={item.key} 
                  className={`item-card ${selectedKeys.includes(item.key) ? 'selected' : ''}`}
                  onDoubleClick={() => item.type === 'folder' ? setPrefix(item.key) : copyUrl(item.url)}
                >
                  <input 
                    type="checkbox" 
                    className="item-checkbox" 
                    checked={selectedKeys.includes(item.key)}
                    onChange={() => toggleSelect(item.key)}
                  />
                  
                  <div className="v-card-img-wrapper" style={{ height: '160px' }}>
                    {item.type === 'folder' ? (
                       <div className="folder-icon">
                          <svg width="60" height="60" viewBox="0 0 24 24" fill="var(--gold-light)" stroke="var(--gold-mid)" strokeWidth="1"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                       </div>
                    ) : (
                      <img src={item.url} alt={item.name} className="v-card-img" />
                    )}
                  </div>

                  <div className="v-card-info" style={{ padding: '12px' }}>
                    <div className="file-name" style={{ fontSize: '13px', fontWeight: 600 }}>{item.name}</div>
                    {item.type === 'file' && (
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
                         {new Date(item.lastModified!).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Bulk Actions Bar */}
      {selectedKeys.length > 0 && (
        <div className="bulk-action-bar">
           <div className="bulk-count">{selectedKeys.length} selected</div>
           <div className="bulk-actions">
              <button className="bulk-btn" onClick={bulkMove}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 21 5"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                Move To
              </button>
              <button className="bulk-btn delete" onClick={bulkDelete}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                Delete
              </button>
           </div>
           <button className="modal-close" style={{ border: 'none', background: 'transparent', color: '#fff' }} onClick={() => setSelectedKeys([])}>×</button>
        </div>
      )}

      {/* Modals */}
      {isFolderModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>New Folder</h3>
            <input 
              className="modal-input" 
              placeholder="Folder name" 
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              autoFocus
            />
            <div className="modal-btns">
               <button className="filter-clear-btn" onClick={() => setIsFolderModalOpen(false)}>Cancel</button>
               <button className="v-add-to-cart-btn" style={{ width: 'auto' }} onClick={createFolder}>Create</button>
            </div>
          </div>
        </div>
      )}

      {notification && (
        <div className={`notification-toast ${notification.type}`} style={{
          position: 'fixed', top: '24px', right: '24px', padding: '16px 24px',
          background: notification.type === 'error' ? '#e63946' : 'var(--gold-gradient)',
          color: '#fff', borderRadius: '12px', zIndex: 3000, boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          fontSize: '14px', fontWeight: 700, animation: 'slideIn 0.3s ease'
        }}>
          {notification.message}
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>
    </div>
  );
}
