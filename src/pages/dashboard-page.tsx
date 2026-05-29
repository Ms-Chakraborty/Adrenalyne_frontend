import { useEffect } from "react";
import { useRoles } from "@/hooks/use-roles";
import { useNavigate } from "react-router";

const DashboardPage: React.FC = () => {
  const { isLoading, isOrganizer, isStaff } = useRoles();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (isOrganizer) {
      navigate("/dashboard/events", { replace: true });
      return;
    }

    if (isStaff) {
      navigate("/dashboard/validate-qr", { replace: true });
      return;
    }

    navigate("/dashboard/tickets", { replace: true });
  }, [isLoading, isOrganizer, isStaff, navigate]);

  return <p>Loading...</p>;
};

export default DashboardPage;
