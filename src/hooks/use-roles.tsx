import { useEffect, useState } from "react";
import { useAuth } from "@/lib/dev-auth";

interface UseRolesReturn {
  isLoading: boolean;
  roles: string[];
  isOrganizer: boolean;
  isAttendee: boolean;
  isStaff: boolean;
}

interface JwtPayload {
  realm_access?: {
    roles?: string[];
  };
}

export const useRoles = (): UseRolesReturn => {
  const { isLoading: isAuthLoading, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [roles, setRoles] = useState<string[]>([]);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [isAttendee, setIsAttendee] = useState(false);
  const [isStaff, setIsStaff] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    if (isAuthLoading || !user?.access_token) {
      setRoles([]);
      setIsOrganizer(false);
      setIsAttendee(false);
      setIsStaff(false);
      setIsLoading(isAuthLoading);
      return;
    }

    try {
      const allRoles = user.profile.roles || [];
      const filteredRoles = allRoles.filter((role) => role.startsWith("ROLE_"));
      setRoles(filteredRoles);
      setIsOrganizer(filteredRoles.includes("ROLE_ORGANIZER"));
      setIsAttendee(filteredRoles.includes("ROLE_ATTENDEE"));
      setIsStaff(filteredRoles.includes("ROLE_STAFF"));
    } catch (error) {
      console.error("Error parsing JWT: " + error);
      setRoles([]);
      setIsOrganizer(false);
      setIsAttendee(false);
      setIsStaff(false);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthLoading, user?.access_token]);

  return {
    isLoading,
    roles,
    isOrganizer,
    isAttendee,
    isStaff,
  };
};
