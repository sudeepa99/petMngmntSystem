"use client";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

import { addPet, deletePet, getAllPets, updatePet } from "../api/petApi";
import { logoutUser } from "../api/auth";

const Dashboard = () => {
  const [pets, setPets] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPet, setCurrentPet] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    breed: "",
    sex: "",
    birthDate: "",
    weight: "",
    notes: "",
  });

  //Display Added Pets
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await getAllPets(token);
        setPets(res.pets);
      } catch (error) {
        toast.error(res.message);
      }
    };

    fetchPets();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      if (isEditing) {
        const res = await updatePet(currentPet._id, formData, token);
        toast.success(res.message);

        const updatedRes = await getAllPets(token);
        setPets(updatedRes.pets);
      } else {
        // Add new pet
        const res = await addPet(formData, token);
        toast.success(res.message);
        const updatedRes = await getAllPets(token);
        setPets(updatedRes.pets);
      }

      // Reset form
      setFormData({
        name: "",
        type: "",
        breed: "",
        sex: "",
        birthDate: "",
        weight: "",
        notes: "",
      });
      setIsEditing(false);
      setCurrentPet(null);
      setShowForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add pet");
    }
  };

  const handleEdit = (pet) => {
    setFormData({
      name: pet.name,
      type: pet.type,
      breed: pet.breed,
      sex: pet.sex,
      birthDate: pet.birthDate
        ? new Date(pet.birthDate).toISOString().split("T")[0]
        : "",
      weight: pet.weight,
      notes: pet.notes,
    });
    setIsEditing(true);
    setCurrentPet(pet);
    setShowForm(true);
  };

  const handleDelete = async (petId) => {
    const token = localStorage.getItem("token");
    if (window.confirm("Are you sure you want to delete this pet?")) {
      try {
        const res = await deletePet(petId, token);
        toast.success(res.message);
        setPets(pets.filter((pet) => pet.id !== petId));
        const updatedRes = await getAllPets(token);
        setPets(updatedRes.pets);
      } catch (error) {
        toast.error(error.response?.data?.message || "  Failed to delete pet");
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      type: "",
      breed: "",
      sex: "",
      birthDate: "",
      weight: "",
      notes: "",
    });
    setIsEditing(false);
    setCurrentPet(null);
    setShowForm(false);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await logoutUser(token);
      toast.success(res.message);
    } catch (err) {
      toast.error(err.message);
    } finally {
      localStorage.removeItem("token");
      router.push("/login");
    }
  };

  const handleHome = () => {
    router.push("/");
  };

  const handleUserProfile = () => {
    router.push("/profile");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                petty<span className="font-normal">world</span>
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleHome}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition duration-150 cursor-pointer"
              >
                Home
              </button>
              <button
                onClick={handleUserProfile}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition duration-150 cursor-pointer"
              >
                User Profile
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition duration-150 cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Pet Dashboard
            </h1>
            <p className="mt-3 text-xl text-gray-500">
              Manage your pet details
            </p>
          </div>

          {/* Add Pet Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={() => setShowForm(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-medium transition duration-150"
            >
              Add New Pet
            </button>
          </div>

          {/* Pet Form */}
          {showForm && (
            <div className="mt-6 bg-white shadow rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">
                {isEditing ? "Edit Pet" : "Add New Pet"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Pet Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Type
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select Type</option>
                      <option value="dog">Dog</option>
                      <option value="cat">Cat</option>
                      <option value="bird">Bird</option>
                      <option value="fish">Fish</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Breed
                    </label>
                    <input
                      type="text"
                      name="breed"
                      value={formData.breed}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Sex
                    </label>
                    <select
                      name="sex"
                      value={formData.sex}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select Sex</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Birth Date
                    </label>
                    <input
                      type="date"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      min="0"
                      step="0.1"
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="3"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md font-medium transition duration-150"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium transition duration-150"
                  >
                    {isEditing ? "Update Pet" : "Add Pet"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Pets List */}
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-6">My Pets</h2>
            {pets.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-500 text-lg">
                  No pets added yet. Add your first pet!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pets.map((pet) => (
                  <div
                    key={pet._id}
                    className="bg-white rounded-lg shadow-md p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-900">
                        {pet.name}
                      </h3>
                      <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {pet.type}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <p>
                        <span className="font-medium">Breed:</span>{" "}
                        {pet.breed || "Not specified"}
                      </p>
                      <p>
                        <span className="font-medium">Sex:</span>{" "}
                        {pet.sex || "Not specified"}
                      </p>
                      <p>
                        <span className="font-medium">Birth Date:</span>{" "}
                        {pet.birthDate
                          ? new Date(pet.birthDate).toISOString().split("T")[0]
                          : "Not specified"}
                      </p>
                      <p>
                        <span className="font-medium">Weight:</span>{" "}
                        {pet.weight ? `${pet.weight} kg` : "Not specified"}
                      </p>
                      {pet.notes && (
                        <p>
                          <span className="font-medium">Notes:</span>{" "}
                          {pet.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-end space-x-2 mt-4">
                      <button
                        onClick={() => handleEdit(pet)}
                        className="text-indigo-600 hover:text-indigo-900 font-medium transition duration-150"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(pet._id)}
                        className="text-red-600 hover:text-red-900 font-medium transition duration-150"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
