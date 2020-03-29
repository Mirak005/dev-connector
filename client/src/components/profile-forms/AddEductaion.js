import React, { useState, Fragment } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { addEducation } from "../../js/actions/profileActions";

const AddEducation = ({ addEducation, history }) => {
  const [formData, setForm] = useState({
    degree: "",
    school: "",
    fieldofstudy: "",
    from: "",
    to: "",
    current: false,
    description: ""
  });
  const [toDateDisabled, toggleDisabled] = useState(false);

  const {
    degree,
    school,
    fieldofstudy,
    from,
    to,
    current,
    description
  } = formData;

  const onChange = e =>
    setForm({ ...formData, [e.target.name]: e.target.value });

  return (
    <Fragment>
      <h1 className="large text-primary">Add your education </h1>
      <p className="lead">
        <i className="fas fa-code-branch"></i> Add any schol or bootcamp you
        have attented
      </p>
      <small>* = required field</small>
      <form
        className="form"
        onSubmit={e => {
          e.preventDefault();
          addEducation(formData, history);
        }}
      >
        <div className="form-group">
          <input
            type="text"
            placeholder="* School or Bootcamp"
            value={school}
            onChange={onChange}
            name="school"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="* Degree or Certificate"
            value={degree}
            onChange={onChange}
            name="degree"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Feild of Study"
            value={fieldofstudy}
            onChange={onChange}
            name="fieldofstudy"
          />
        </div>
        <div className="form-group">
          <h4>From Date</h4>
          <input type="date" value={from} onChange={onChange} name="from" />
        </div>
        <div className="form-group">
          <p>
            <input
              type="checkbox"
              checked={current}
              onChange={e => {
                setForm({ ...formData, current: !current });
                toggleDisabled(!toDateDisabled);
              }}
              value={current}
              name="current"
              value=""
            />{" "}
            Current Studies
          </p>
        </div>
        <div className="form-group">
          <h4>To Date</h4>
          <input
            type="date"
            value={to}
            name="to"
            onChange={onChange}
            disabled={toDateDisabled ? "disabled" : ""}
          />
        </div>
        <div className="form-group">
          <textarea
            value={description}
            onChange={onChange}
            name="description"
            cols="30"
            rows="5"
            placeholder="Programme Description"
          ></textarea>
        </div>
        <input type="submit" className="btn btn-primary my-1" />
        <Link className="btn btn-light my-1" to="/dashboard">
          Go Back
        </Link>
      </form>
    </Fragment>
  );
};

AddEducation.propTypes = {
  addEducation: PropTypes.func.isRequired
};

export default connect(null, { addEducation })(withRouter(AddEducation));
