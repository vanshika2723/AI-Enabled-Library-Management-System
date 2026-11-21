const User = require("../models/User");

// Get all registered students (Admin only)
const getAllStudents = async (req, res) => {
  try {
    const { search, status, department } = req.query;

    const filter = {
      role: "student"
    };

    // Active / Inactive filter
    if (status === "Active") {
      filter.isActive = true;
    } else if (status === "Inactive") {
      filter.isActive = false;
    }

    // Department filter
    if (department && department !== "All") {
      filter.department = department;
    }

    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { studentId: { $regex: search, $options: "i" } },
        { department: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } }
      ];
    }

    const students = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    const totalStudents = await User.countDocuments({
      role: "student"
    });

    const activeStudents = await User.countDocuments({
      role: "student",
      isActive: true
    });

    const inactiveStudents = await User.countDocuments({
      role: "student",
      isActive: false
    });

    res.status(200).json({
      success: true,
      total: students.length,
      totalStudents,
      activeStudents,
      inactiveStudents,
      students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
// Update student details (Admin only)
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, studentId, department } = req.body;

    const student = await User.findOne({ _id: id, role: "student" });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (name !== undefined) student.name = name;
    if (email !== undefined) student.email = email;
    if (phone !== undefined) student.phone = phone;
    if (studentId !== undefined) student.studentId = studentId;
    if (department !== undefined) student.department = department;

    await student.save();

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      student: {
        _id: student._id,
        name: student.name,
        email: student.email,
        phone: student.phone,
        studentId: student.studentId,
        department: student.department,
        isActive: student.isActive,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Delete student (Admin only)
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await User.findOne({
      _id: id,
      role: "student",
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    await User.deleteOne({ _id: id, role: "student" });

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  getAllStudents,
    updateStudent,
    deleteStudent,
};