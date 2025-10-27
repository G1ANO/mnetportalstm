import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <p>Please log in first.</p>;

  return user.role === "admin" ? (
    <AdminDashboard admin={user} />
  ) : (
    <UserDashboard user={user} />
  );
}
