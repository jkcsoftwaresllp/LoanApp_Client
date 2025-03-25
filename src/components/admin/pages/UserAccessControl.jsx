import React, { useState } from "react";
import styles from "./style/UserAccessControl.module.css";

const UserAccessControl = () => {
  const [roles, setRoles] = useState([
    {
      role: "admin",
      permissions: ["view_dashboard", "edit_users", "manage_loans"]
    },
    {
      role: "manager",
      permissions: ["view_dashboard", "manage_loans"]
    },
    {
      role: "analyst",
      permissions: ["view_dashboard"]
    }
  ]);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleRoleChange = (role) => {
    const selected = roles.find(r => r.role === role);
    setSelectedRole(role);
    setSelectedPermissions([...selected.permissions]);
  };

  const handlePermissionChange = (permission) => {
    setSelectedPermissions(prev => 
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  const handleUpdatePermissions = async () => {
    if (!selectedRole) {
      alert("Please select a role");
      return;
    }

    setIsUpdating(true);
    try {
      console.log("PATCH /api/admin/update-permissions", {
        role: selectedRole,
        permissions: selectedPermissions
      });
      
      // Simulate API response
      const response = { 
        status: "success", 
        message: "Permissions updated",
        updated_values: {
          role: selectedRole,
          permissions: selectedPermissions
        }
      };
      console.log(response);
      
      // Update local state
      setRoles(prev => 
        prev.map(role => 
          role.role === selectedRole
            ? { ...role, permissions: selectedPermissions }
            : role
        )
      );
      alert("Permissions updated successfully!");
    } catch (error) {
      console.error("Error updating permissions:", error);
      alert("Failed to update permissions");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2>User Access Control</h2>
      
      <div className={styles.roleSelector}>
        <label>Select Role:</label>
        <select
          value={selectedRole}
          onChange={(e) => handleRoleChange(e.target.value)}
        >
          <option value="">Select a role</option>
          {roles.map(role => (
            <option key={role.role} value={role.role}>
              {role.role}
            </option>
          ))}
        </select>
      </div>

      {selectedRole && (
        <div className={styles.permissionsSection}>
          <h3>Permissions for {selectedRole}</h3>
          <div className={styles.permissionsList}>
            {[
              "view_dashboard",
              "edit_users",
              "manage_loans",
              "view_reports",
              "manage_settings"
            ].map(permission => (
              <label key={permission} className={styles.permissionItem}>
                <input
                  type="checkbox"
                  checked={selectedPermissions.includes(permission)}
                  onChange={() => handlePermissionChange(permission)}
                />
                {permission}
              </label>
            ))}
          </div>
          
          <button
            className={styles.updateButton}
            onClick={handleUpdatePermissions}
            disabled={isUpdating}
          >
            {isUpdating ? "Updating..." : "Update Permissions"}
          </button>
        </div>
      )}
    </div>
  );
};

export default UserAccessControl;