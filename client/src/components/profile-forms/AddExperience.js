import React, { useState, Fragment } from "react";
import PropTypes from "prop-types";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { addExperience } from "../../js/actions/profileActions";

const AddExperience = ({ addExperience  , history}) => {
  const [formData, setForm] = useState({
    title: "",
    company: "",
    location: "",
    from: "",
    to: "",
    current: false,
    description: ""
  });
  const [toDateDisabled, toggleDisabled] = useState(false);

  const { title, company, location, from, to, current, description } = formData;

  const onChange = e =>
    setForm({ ...formData, [e.target.name]: e.target.value });

  return (
    <Fragment>
      <h1 className="large text-primary">Add An Experience</h1>
      <p className="lead">
        <i className="fas fa-code-branch"></i> Add any developer/programming
        positions that you have had in the past
      </p>
      <small>* = required field</small>
      <form className="form" onSubmit={(e)=>{
          e.preventDefault();
          addExperience(formData , history)
      }}>
        <div className="form-group">
          <input
            type="text"
            placeholder="* Job Title"
            value={title}
            onChange={onChange}
            name="title"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="* Company"
            value={company}
            onChange={onChange}
            name="company"
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={onChange}
            name="location"
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
            Current Job
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
            placeholder="Job Description"
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

AddExperience.propTypes = {
  addExperience: PropTypes.func.isRequired
};

export default connect(null, { addExperience })(withRouter(AddExperience));
