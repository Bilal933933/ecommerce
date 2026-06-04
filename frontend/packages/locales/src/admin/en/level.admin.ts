// packages/locales/en/levelAdmin.ts

export const levelAdmin = {
  // Page title
  title: "Academic Levels",
  description: "Manage academic levels for the platform",
  
  // Buttons
  addButton: "Add Level",
  addFirst: "Add First Level",
  editButton: "Edit",
  deleteButton: "Delete",
  
  // Loading states
  loading: "Loading...",
  noData: "No academic levels yet",
  
  // Form fields
  nameLabel: "Level Name",
  namePlaceholder: "Example: Elementary School",
  descriptionLabel: "Description (Optional)",
  descriptionPlaceholder: "Brief description of the level",
  orderLabel: "Order",
  orderPlaceholder: "1",
  
  // Field errors
  nameRequired: "Level name is required",
  nameMin: "Level name must be at least 3 characters",
  nameMax: "Level name must not exceed 50 characters",
  orderInvalidType: "Order must be a number",
  orderMin: "Order must be at least 1",
  orderInteger: "Order must be an integer",
  
  // Dialog messages
  createTitle: "Add New Level",
  editTitle: "Edit Level",
  deleteTitle: "Delete Level",
  deleteDescription: "Are you sure you want to delete level \"{name}\"? All associated grades will also be deleted. This action cannot be undone.",
  
  // Success messages
  createSuccess: "Level created successfully",
  updateSuccess: "Level updated successfully",
  deleteSuccess: "Level deleted successfully",
  
  // Error messages
  errorOccurred: "An error occurred",
  createError: "Failed to create level",
  updateError: "Failed to update level",
  deleteError: "Failed to delete level",
  orderConflict: "Level order is already in use",
  
  // Dialog buttons
  cancel: "Cancel",
  confirmDelete: "Confirm Delete",
  save: "Save Changes",
  create: "Create Level",
  
  // Action states
  saving: "Saving...",
  deleting: "Deleting...",
} as const;