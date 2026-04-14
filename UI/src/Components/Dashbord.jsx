import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MemberForm from "./Form";
import axios from "axios";

const Dashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    getMembers();
  }, []);

  async function getMembers() {
    setLoading(true);
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/get_all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        setMembers(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const totalCount = members.length;
  const activeCount = members.filter((m) => m.status === "active").length;
  const permanentCount = members.filter(
    (m) => m.membership_type === "Permanent"
  ).length;
  const temporaryCount = members.filter(
    (m) => m.membership_type === "Temporary"
  ).length;

  const filteredMembers = members
    .filter((m) => {
      if (filter === "all") return true;
      if (filter === "active") return m.status === "active";
      if (filter === "permanent") return m.membership_type === "Permanent";
      if (filter === "temporary") return m.membership_type === "Temporary";
      return true;
    })
    .filter((m) =>
      m.name?.toLowerCase().includes(search.toLowerCase())
    );

  const filterCards = [
    {
      key: "all",
      label: "Total",
      sub: "Members",
      count: totalCount,
      active: "bg-blue-600 border-blue-600 text-white shadow-lg",
      inactive: "bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100",
    },
    {
      key: "active",
      label: "Active",
      sub: "Members",
      count: activeCount,
      active: "bg-green-600 border-green-600 text-white shadow-lg",
      inactive:
        "bg-green-50 border-green-200 text-green-800 hover:bg-green-100",
    },
    {
      key: "permanent",
      label: "Permanent",
      sub: "Members",
      count: permanentCount,
      active: "bg-yellow-600 border-yellow-600 text-white shadow-lg",
      inactive:
        "bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100",
    },
    {
      key: "temporary",
      label: "Temporary",
      sub: "Members",
      count: temporaryCount,
      active: "bg-red-600 border-red-600 text-white shadow-lg",
      inactive: "bg-red-50 border-red-200 text-red-800 hover:bg-red-100",
    },
  ];

  return (
    <div className="h-full w-full overflow-hidden bg-white flex items-center gap-3 justify-center">
      {showForm && <MemberForm onClose={() => setShowForm(false)} />}

      <div className="w-[90%] bg-white shadow-sm rounded flex flex-col gap-5">
        {/* Header */}
        <div className="w-full flex justify-center items-center h-24  border-yellow-300">
          <h1 className="text-2xl md:text-5xl font-bold text-yellow-700 tracking-wide text-center">
            पशुपतिनाथ नेपाली समाज, भोपाल
          </h1>
        </div>

        {/* Title + Add Button */}
        <div className="flex justify-between items-center text-5xl h-20 px-4 py-2 text-black rounded-t">
          <h2 className="h-20 flex justify-center items-center rounded-3xl font-bold">
            Member Dashboard
          </h2>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl border border-blue-700 font-semibold text-base shadow-md hover:bg-blue-700 hover:shadow-lg active:scale-95 transition-all duration-150 tracking-wide"
          >
            + Add Member
          </button>
        </div>

        {/* Filter Cards */}
        <div className="grid grid-cols-4 gap-5 p-4 font-semibold">
          {filterCards.map((card) => (
            <div
              key={card.key}
              onClick={() => setFilter(card.key)}
              className={`border h-24 flex flex-col items-center justify-center rounded cursor-pointer transition ${
                filter === card.key ? card.active : card.inactive
              }`}
            >
              <span className="text-2xl font-bold">{card.count}</span>
              <span className="text-xl font-bold">{card.label}</span>
              <span className="text-sm">{card.sub}</span>
            </div>
          ))}
        </div>

        {/* Search Bar */}
        <div className="px-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍  Search member by name..."
            className="w-72 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
          />
        </div>

        {/* Table / Loading */}
        <div className="px-4 pb-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              {/* Spinner */}
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-gray-500 text-lg font-medium">
                Loading members...
              </p>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2">
              <p className="text-gray-400 text-lg">No members found.</p>
            </div>
          ) : (
            <table className="w-full border border-gray-300 text-base">
              <thead className="bg-gray-200 text-gray-800">
                <tr>
                  <th className="px-5 py-4 text-left font-bold text-lg">
                    Sr. No.
                  </th>
                  <th className="px-5 py-4 text-left font-bold text-lg">
                    Member Name
                  </th>
                  <th className="px-5 py-4 text-left font-bold text-lg">
                    Membership Type
                  </th>
                  <th className="px-5 py-4 text-left font-bold text-lg">
                    Phone Number
                  </th>
                  <th className="px-5 py-4 text-left font-bold text-lg">
                    Join Date
                  </th>
                  <th className="px-5 py-4 text-center font-bold text-lg">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((m, i) => (
                  <tr
                    key={i}
                    className={`${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-100 transition`}
                  >
                    <td className="px-5 py-6 text-base text-gray-500 font-medium">{i + 1}</td>
                    <td className="px-5 py-6 text-base">{m.name}</td>
                    <td className="px-5 py-6 text-base">
                      <span
                        className={`px-2 py-0.5 rounded-full text-sm font-semibold ${
                          m.membership_type === "Temporary"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {m.membership_type}
                      </span>
                    </td>
                    <td className="px-5 py-6 font-semibold text-base">
                      {m.phone_number}
                    </td>
                    <td className="px-5 py-6 text-base">
                      {m.registration_date?.substring(0, 10)}
                    </td>
                    <td className="px-5 py-6 text-center">
                      <button
                        onClick={() => navigate(`/details/${m.id}`)}
                        className="px-4 py-1.5 text-sm text-blue-600 hover:underline"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;