import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../App";
import { useNavigate, useParams } from "react-router-dom";

function EditLesson() {
  const { setOnload, route, token } = useContext(AppContext);
  const [title, setTitle] = useState("");
  const [vid, setVid] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [type, setType] = useState("");
  const [err, setErr] = useState("");
  const [profileImg, setProfileImg] = useState(null);
  const [cousrses, setCourses] = useState([]);
  const [data, setData] = useState({});
  const nav = useNavigate();
  const id = useParams().id;
  useEffect(() => {
    fetch(`${route}/education/courses`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setCourses(data.data));
    fetch(`${route}/education/lessons/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setData(data.data));
  }, []);
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setProfileImg(file);
    } else {
      setProfileImg(null);
    }
  };
  const handelSubmit = function (e) {
    e.preventDefault();
    const formData = new FormData();
    if (title) {
      formData.append("title", title);
    }
    if (selectedCourse) {
      formData.append("course", selectedCourse);
    }
    if (profileImg) {
      formData.append("image", profileImg, profileImg.name);
    }
    if (type) {
      formData.append("type", type);
    }
    if (vid) {
      formData.append("videoUrl", vid);
    }

    setOnload(true);
    fetch(`${route}/education/lessons/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data?.errors) {
          setErr(data.errors[0].msg);
        }
        if (data.data) {
          nav("/all-lessons");
        }
        setOnload(false);
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="main-sec">
      <h2>Edit Lesson </h2>
      <form onSubmit={(e) => handelSubmit(e)}>
        <div className="input-group">
          <label>Title :</label>
          <input
            placeholder={data?.title}
            type="text"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label>Video Link :</label>
          <input
            placeholder={data?.videoUrl}
            type="text"
            onChange={(e) => setVid(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Course :</label>
          <select onChange={(e) => setSelectedCourse(e.target.value)}>
            {cousrses?.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
        <div className="input-group">
          <label>Type :</label>
          <select onChange={(e) => setType(e.target.value)}>
            <option value="recorded">recorded</option>
            <option value="live">live</option>
          </select>
        </div>

        <div className="input-group">
          <label>Image :</label>
          <input type="file" onChange={handleImageChange} name="" id="" />
        </div>

        {err && <p className="error">{err}</p>}

        <button type="submit" className="submit">
          Edit
        </button>
      </form>
    </div>
  );
}

export default EditLesson;
