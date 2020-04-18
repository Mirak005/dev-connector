import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { removeComment } from "../../js/actions/postAction";

const CommentItem = ({
  comment: { _id, text, name, avatar, user, date },
  auth,
  postId,
  removeComment,
  postOwner
}) => {
  return (
    <div className="post bg-white p-1 my-1">
      <div>
        <Link to={`/profile/${user}`}>
          <img src={avatar} alt="avatar" />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p className="my-1">{text}</p>
        <p className="post-date">
          Posted on <Moment format="YYYY/MM/DD">{date}</Moment>
        </p>
        {auth.isAuth &&
          ((!auth.loading && auth.user._id === user) ||
            auth.user._id === postOwner) && (
            <button
              className="btn btn-danger"
              onClick={() => removeComment(postId, _id)}
            >
              <i className="fas fa-times"></i>
            </button>
          )}
      </div>
    </div>
  );
};

CommentItem.propTypes = {
  postId: PropTypes.string.isRequired,
  comment: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { removeComment })(CommentItem);
