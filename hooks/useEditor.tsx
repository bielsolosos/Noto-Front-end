"use client";

import { useNotes } from "@/contexts/NotesContext";
import { useCallback, useEffect, useRef, useState } from "react";

export function useEditor() {
  const { selectedPage, updatePage } = useNotes();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (selectedPage) {
      setEditTitle(selectedPage.title);
      setEditContent(selectedPage.content);
      setHasUnsavedChanges(false);
      setIsEditing(false);
    }
  }, [selectedPage?.id]);

  // Debug effect to track state changes
  useEffect(() => {
    console.log("Editor state changed:", {
      isEditing,
      hasUnsavedChanges,
      selectedPageId: selectedPage?.id,
    });
  }, [isEditing, hasUnsavedChanges, selectedPage?.id]);

  const savePage = useCallback(async () => {
    if (!selectedPage || !hasUnsavedChanges) return;

    try {
      await updatePage(selectedPage.id, {
        title: editTitle,
        content: editContent,
      });
      setHasUnsavedChanges(false);
      setIsEditing(false);
    } catch (error) {
      // Error is handled in the context
    }
  }, [selectedPage, editTitle, editContent, hasUnsavedChanges, updatePage]);

  const cancelEdit = useCallback(() => {
    if (selectedPage) {
      setEditTitle(selectedPage.title);
      setEditContent(selectedPage.content);
    }
    setHasUnsavedChanges(false);
    setIsEditing(false);
  }, [selectedPage]);

  const handleTitleChange = useCallback((newTitle: string) => {
    setEditTitle(newTitle);
    setHasUnsavedChanges(true);
  }, []);

  const handleContentChange = useCallback((newContent: string) => {
    setEditContent(newContent);
    setHasUnsavedChanges(true);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "s":
            e.preventDefault();
            if (isEditing) savePage();
            break;
          case "e":
            e.preventDefault();
            if (!isEditing && selectedPage) setIsEditing(true);
            break;
        }
      }
      if (e.key === "Escape" && isEditing) {
        cancelEdit();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [savePage, isEditing, selectedPage, cancelEdit]);

  return {
    isEditing,
    setIsEditing,
    editTitle,
    editContent,
    hasUnsavedChanges,
    textareaRef,
    savePage,
    cancelEdit,
    handleTitleChange,
    handleContentChange,
  };
}
