import React, { Component } from 'react';
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle
} from 'reactstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { URLParamToString } from '../../utils/formatHelpers';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import '../../styles/ReadingOlympics.scss';
import book from '../../images/book-fa.png';
library.add(faBook);

class CatalogCardBook extends Component {
  renderBookImage = () => {
    const { onClickBook } = this.props;
    const { cover_url } = this.props.book;
    if (cover_url === undefined || cover_url === null || cover_url === '') {
      return (
        <div className="book-image-container">
          <CardImg
            className="book-image empty"
            src={book}
            onClick={onClickBook}
            alt=""
          />
        </div>
      );
    }

    return (
      <div className="book-image-container">
        <CardImg
          className="book-image"
          src={cover_url}
          onClick={onClickBook}
          alt=""
        />
      </div>
    );
  };

  render() {
    // TODO Should be able to click year/grade to go to that page? Or is that too confusing?
    const { book, onClickBook } = this.props;

    return (
      <Card className="book-card">
        <CardBody>
          {this.renderBookImage()}
          <CardTitle onClick={onClickBook}>
            {`${book.name} by ${book.author}`}
          </CardTitle>
          <CardSubtitle>
            {URLParamToString(book.grade)}
            <br />
            {`Reading Olympics ${book.year}`}
          </CardSubtitle>
          <CardText>{book.description}</CardText>
        </CardBody>
        <Link to={`/ReadingOlympics/book/${book.id}`}>
          <span />
        </Link>
      </Card>
    );
  }
}

CatalogCardBook.propTypes = {
  onClickBook: PropTypes.func
};

export default CatalogCardBook;
