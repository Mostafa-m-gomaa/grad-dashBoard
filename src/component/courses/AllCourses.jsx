import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../App";
import { Link } from "react-router-dom";
function AllCourses() {
  const token = localStorage.getItem("token");
  const { route, setOnload } = useContext(AppContext);
  const [courses, setCourses] = useState([]);
  const [isPop, setIsPop] = useState(false);
  const [delId, setDelId] = useState("");
  const [refresh, setRefresh] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [pagesNumber, setPagesNumber] = useState(0);

  const handelDelete = function () {
    setOnload(true);
    fetch(`${route}/education/courses/${delId}`, {
      method: "Delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(() => {
        setRefresh((prev) => prev + 1);
        setDelId("");
        setIsPop(false);
        setOnload(false);
      });
  };
  useEffect(() => {
    setOnload(true);

    fetch(`${route}/education/courses?page=${currentPage}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCourses(data.data);
        setPagesNumber(data.paginationResult.numberOfPages);
        setOnload(false);
      });
  }, [refresh]);
  return (
    <div className="main-sec">
      {isPop && (
        <div className="popUp">
          <div>
            <h2>Are You Sure you want to delete this user</h2>
            <div>
              <span className="del" onClick={() => handelDelete()}>
                Yes
              </span>
              <span
                className="edit"
                onClick={() => {
                  setIsPop(false);
                  setDelId("");
                }}
              >
                No
              </span>
            </div>
          </div>
        </div>
      )}

      <h2>All Courses</h2>
      <table>
        <thead>
          <tr>
            <td>Title</td>
            <td>Category</td>
            <td>Instructor</td>
            <td>price</td>
            <td>students</td>
            <td>actions</td>
          </tr>
        </thead>
        <tbody>
          {courses?.map((course) => (
            <tr key={course._id}>
              <td>{course.title}</td>
              <td>{course.category.title}</td>
              <td>{course.instructor.name}</td>
              <td>
                {course.priceAfterDiscount
                  ? course.priceAfterDiscount
                  : course.price}
                $
              </td>
              <td>{course?.users?.length}</td>
              <td className="actions">
                <div
                  className="del"
                  onClick={() => {
                    setIsPop(true);
                    setDelId(course._id);
                  }}
                >
                  Delete
                </div>
                <Link to={`/edit-course/${course._id}`} className="edit">
                  Edit
                </Link>
                <Link to={`${course._id}`} className="edit">
                  details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>we have {pagesNumber} pages</h2>
      <div className="pagination">
        <div
          className={`paginationBtn ${currentPage >= 2 ? "" : "off"}`}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          previous
        </div>

        <div>{currentPage}</div>

        <div
          className={`paginationBtn ${pagesNumber > currentPage ? "" : "off"}`}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          next
        </div>
      </div>
    </div>
  );
}

export default AllCourses;
