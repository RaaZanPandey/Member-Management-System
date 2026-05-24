import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MemberForm from "./Form";
import axios from "axios";
import { toast } from "react-toastify";
import { Eye, Pencil, Trash2, UserPlus, Upload, Download, Menu, X, LogOut } from "lucide-react";

const Dashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [area, setArea] = useState("All");
  const [selectedMember, setSelectedMember] = useState(null);
  const fileInputRef = useRef(null);
  const [open, setOpen] = useState(false);


  useEffect(() => {
    getMembers();
  }, []);

  const areaFiltered = members.filter((m) => area === "All" || m.area === area);

  const totalCount = areaFiltered.length;
  const LifetimeCount = areaFiltered.filter((m) => m.membership_type === "Lifetime").length;
  const GeneralCount = areaFiltered.filter((m) => m.membership_type === "General").length;
  const DefaulterCount = areaFiltered.filter((m) => m.membership_type === "Defaulter").length;

  const filteredMembers = areaFiltered
    .filter((m) => {
      if (filter === "all") return true;
      if (filter === "Lifetime") return m.membership_type === "Lifetime";
      if (filter === "General") return m.membership_type === "General";
      if (filter === "Defaulter") return m.membership_type === "Defaulter";
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
      key: "Lifetime",
      label: "Lifetime",
      sub: "Members",
      count: LifetimeCount,
      active: "bg-green-600 border-green-600 text-white shadow-lg",
      inactive: "bg-green-50 border-green-200 text-green-800 hover:bg-green-100",
    },
    {
      key: "General",
      label: "General",
      sub: "Members",
      count: GeneralCount,
      active: "bg-yellow-600 border-yellow-600 text-white shadow-lg",
      inactive: "bg-yellow-50 border-yellow-200 text-yellow-800 hover:bg-yellow-100",
    },
    {
      key: "Defaulter",
      label: "Defaulter",
      sub: "Members",
      count: DefaulterCount,
      active: "bg-red-600 border-red-600 text-white shadow-lg",
      inactive:
        "bg-red-50 border-red-200 text-red-800 hover:bg-red-100",
    },
  ];

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
      toast.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleClick(e) {
    if (filter == "Defaulter") {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      try {
        const response = await axios.post("http://127.0.0.1:8000/api/update_default", {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          toast.success("Defaulter reloded succesfully !")
        }
      } catch (error) {
        toast.error("Something went wrong ! try again later");
      } finally {
        setLoading(false);
      }
    } else {
      getMembers()
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this member?")) return;

    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/api/delete_member/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        toast.success("Member deleted successfully!");
        getMembers();
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  }

  async function handleExport() {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/backup",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error("Export failed! Try again.");
    }
  }


  function handleImportClick() {
    fileInputRef.current.click();
  }

  async function handleImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    const token = localStorage.getItem("authToken");
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/import-csv",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        getMembers();
      }
    } catch (error) {
      toast.error("Import failed! Try again.");
    }
  }

  async function handleExport() {

    const token = localStorage.getItem("authToken");
    const response = await axios.get("http://127.0.0.1:8000/api/export-csv",
      { headers: { Authorization: `Bearer ${token}` } },
      {
        responseType: "blob", // tells browser to expect a file
      });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "members.csv"); // downloads to machine
    link.click(); // triggers download 
  }

  async function handleLogout() {
    const token = localStorage.getItem("authToken");
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/logout",{},{
         headers: { Authorization: `Bearer ${token}` } 
      })
      if(response.status == 200){
        localStorage.removeItem("authToken");
        toast.success("Log out succesfully")
        navigate('/')
      }
    } catch (error) {
      toast.error("Something went wrong! please try again later")
    }
  }
  return (


    <div className="h-full w-full overflow-hidden bg-white flex items-center gap-3 justify-center">
      {showForm && (
        <MemberForm
          member={selectedMember}
          onClose={() => {
            setShowForm(false);
            setSelectedMember(null);
          }}
        />
      )}


      <div className="w-[90%] bg-white shadow-sm rounded flex flex-col gap-5">
        <div className="w-full flex justify-center items-center h-24  border-yellow-300">
          <h1 className="text-2xl md:text-5xl font-bold text-yellow-700 tracking-wide text-center">
            पशुपतिनाथ नेपाली समाज, भोपाल
          </h1>
        </div>

       <div className="fixed top-5 right-5 z-50">

  <button
    onClick={() => setOpen(!open)}
    className="p-2 rounded-xl bg-green-500 text-white shadow-md hover:scale-105 transition-all duration-200"
  >
    {open ? <X size={18} /> : <Menu size={18} />}
  </button>

  {open && (
  <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl shadow-2xl p-2 flex flex-col gap-2">
    <button
      onClick={() => navigate("/")}
      className="w-full py-3 rounded-xl bg-gray-300 text-gray-800 font-medium text-sm hover:bg-gray-200 transition-all duration-200 hover:scale-[1.02]"
    >
      Login
    </button>
    <button
      onClick={() => navigate("/register")}
      className="w-full py-3 rounded-xl bg-green-500 text-white font-medium text-sm hover:bg-green-600 transition-all duration-200 hover:scale-[1.02] shadow-md"
    >
      Sign Up
    </button>
    <div className="border-t my-1"></div>

    <button
      onClick={handleLogout}
      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 text-red-600 font-medium text-sm hover:bg-red-100 transition-all duration-200 hover:scale-[1.02]"
    >
      <LogOut size={16} />
      Logout
    </button>

  </div>
)}
</div>

        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 rounded-xl gap-4">

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900 leading-tight">Member Dashboard</h2>
              <p className="text-xs text-gray-500">Manage and track all members</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => { setShowForm(true); setSelectedMember(null); }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg border border-blue-700 transition-all active:scale-95"
            >
              <UserPlus size={15} />
              Add Member
            </button>

            <div className="w-px h-7 bg-gray-200 mx-1" />

            <button
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-700 hover:bg-green-800 text-white text-sm font-medium rounded-lg border border-green-800 transition-all active:scale-95"
            >
              <Upload size={15} />
              Export
            </button>

            <input ref={fileInputRef} type="file" accept=".csv" onChange={handleImport} className="hidden" />

            <button
              onClick={handleImportClick}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg border border-amber-700 transition-all active:scale-95"
            >
              <Download size={15} />
              Import
            </button>
          </div>

        </div>

        <div className="grid grid-cols-4 gap-5 p-4 font-semibold">
          {filterCards.map((card) => (
            <div
              key={card.key}
              onClick={() => setFilter(card.key)}
              className={`border h-24 flex flex-col items-center justify-center rounded cursor-pointer transition ${filter === card.key ? card.active : card.inactive
                }`}
            >
              <span className="text-2xl font-bold">{card.count}</span>
              <span className="text-xl font-bold">{card.label}</span>
              <span className="text-sm">{card.sub}</span>
            </div>
          ))}
        </div>

        {/* Search bar */}
        <div className="px-4 flex flex-row items-center justify-between">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍  Search member by name..."
            className="w-72 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition"
          />
          <div className="flex flex-row items-center gap-3">
            <button
              onClick={() => { handleClick() }}
              title="Reload Members"
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-600 shadow-sm transition-all duration-150 active:rotate-180"
            >
              ↻
            </button>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition bg-white text-gray-700"
            >
              <option value="All">All Areas</option>
              <option value="Govindpura">Govindpura</option>
              <option value="Siddipura">Siddipura</option>
              <option value="Shivaji Nagar">Shivaji Nagar</option>
              <option value="Bharat Nagar">Bharat Nagar</option>
              <option value="Kolar Colony">Kolar Colony</option>
              <option value="Arera Colony">Arera Colony</option>
              <option value="TT Nagar">TT Nagar</option>
              <option value="Vallabh Nagar">Vallabh Nagar</option>
              <option value="Jahangirabad">Jahangirabad</option>
              <option value="Purani Bhopal">Purani Bhopal</option>
              <option value="Audyogik Kshetra">Audyogik Kshetra</option>
            </select>
          </div>
        </div>
        {/* Table */}
        <div className="px-4 pb-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-gray-500 text-lg font-medium">Loading members...</p>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-2">
              <p className="text-gray-400 text-lg">No members found.</p>
            </div>
          ) : (
            <table className="w-full border border-gray-300 text-base table-fixed">
              <thead className="bg-gray-200 text-gray-800">
                <tr>
                  <th className="px-5 py-4 text-left font-bold text-lg w-16">Sr. No.</th>
                  <th className="px-5 py-4 text-left font-bold text-lg w-40">Member Name</th>
                  <th className="px-5 py-4 text-left font-bold text-lg w-40">Registration No.</th>
                  <th className="px-5 py-4 text-left font-bold text-lg w-40">Membership Type</th>
                  <th className="px-5 py-4 text-left font-bold text-lg w-40">Phone Number</th>
                  <th className="px-5 py-4 text-left font-bold text-lg w-36">Area</th>
                  <th className="px-5 py-4 text-center font-bold text-lg w-32">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((m, i) => (
                  <tr
                    key={i}
                    className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100 transition`}
                  >

                    <td className="px-5 py-4 text-base text-gray-500 font-medium">{i + 1}</td>

                    <td className="px-5 py-4 text-base">
                      <div className="flex items-center gap-2">
                        {m.name}
                        {m.is_board_members === "Yes" && (
                          <div className="relative group">
                            <span className="inline-flex items-center gap-1 px-2.5 py-2.5 rounded-full text-sm font-bold bg-blue-600 text-white border border-blue-700 shadow-md cursor-pointer">
                              ★
                            </span>
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-100 text-black text-xs font-medium px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                              Board Member
                              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800" />
                            </div>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4 font-semibold text-base">{m.registration_number}</td>


                    <td className="px-5 py-4 text-base">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide inline-flex items-center gap-1.5
                        ${m.membership_type === "Defaulter" && "bg-red-100 text-red-700 border border-red-300"}
                        ${m.membership_type === "Lifetime" && "bg-emerald-100 text-emerald-700 border border-emerald-300"}
                        ${m.membership_type === "General" && "bg-blue-100 text-blue-700 border border-blue-300"}
                     `}>
                        <span className={`w-1.5 h-1.5 rounded-full
                         ${m.membership_type === "Defaulter" && "bg-red-500"}
                         ${m.membership_type === "Lifetime" && "bg-emerald-500"}
                         ${m.membership_type === "General" && "bg-blue-500"}
                         `} />
                        {m.membership_type}
                      </span>
                    </td>

                    <td className="px-5 py-4 font-semibold text-base">{m.phone_number}</td>
                    <td className="px-5 py-4 text-base">{m.area}</td>

                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => navigate(`/details/${m.id}`)}
                          title="View Details"
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-600 hover:text-white transition-all duration-150 shadow-sm"
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          onClick={() => {
                            setSelectedMember(m);
                            setShowForm(true);
                          }}
                          title="Edit Member"
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-green-50 text-green-600 border border-green-200 hover:bg-green-600 hover:text-white transition-all duration-150 shadow-sm"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          onClick={() => handleDelete(m.id)}
                          title="Delete Member"
                          className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white transition-all duration-150 shadow-sm"
                        >
                          <Trash2 size={15} />
                        </button>

                      </div>
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