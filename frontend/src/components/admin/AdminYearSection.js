import React, { Component } from 'react';
import {
  Alert,
  Card,
  CardBody,
  Form,
  FormGroup,
  Input,
  Label,
  FormFeedback,
  FormText,
  Button
} from 'reactstrap';
import { Link } from 'react-router-dom';
import AdminYearModal from './AdminYearModal';
import {
  getROCurrentYear,
  setROActiveYear,
  publishAllBooksInYear
} from '../../utils/api';

class AdminYearSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      success: null,
      confirmationModalOpen: false,
      successModalOpen: false,
      originalReadingOlympicsYear: '',
      readingOlympicsYear: '',
      errors: [],
      numSubmits: 0
    };
    this.getROCurrentYear();
  }

  getROCurrentYear = async () => {
    const {
      success,
      result: { year },
      message
    } = await getROCurrentYear();
    if (success) {
      this.setState({
        originalReadingOlympicsYear: year,
        readingOlympicsYear: year,
        errors: []
      });
    } else {
      this.setError(message);
    }
  };

  allowSubmitChangeYear = () => {
    const { originalReadingOlympicsYear, readingOlympicsYear } = this.state;
    return (
      originalReadingOlympicsYear !== readingOlympicsYear &&
      !isNaN(readingOlympicsYear) &&
      readingOlympicsYear.length === 4
    );
  };

  setError = message => {
    this.setState(state => ({
      errors: [{ message: message, key: state.numSubmits }],
      numSubmits: state.numSubmits + 1 //this is here so a new key is used, regenerating the element so the user knows the button was clicked.
    }));
  };

  handleSubmit = async event => {
    event.preventDefault();
    if (!this.allowSubmitChangeYear) {
      return;
    }
    this.setState({ confirmationModalOpen: false });
    const { readingOlympicsYear } = this.state;
    const { message, success } = await setROActiveYear(
      parseInt(readingOlympicsYear)
    );
    if (success) {
      const {
        success: publishSuccess,
        message: publishMessage
      } = await publishAllBooksInYear(parseInt(readingOlympicsYear));
      if (publishSuccess) {
        this.setState({
          success: true,
          successModalOpen: true,
          originalReadingOlympicsYear: readingOlympicsYear
        });
      } else {
        this.setError(publishMessage);
      }
    } else {
      this.setError(message);
    }
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  renderConfirmationModal = () => {
    if (!this.state.confirmationModalOpen) {
      return null;
    }

    return (
      <AdminYearModal
        isOpen={this.state.confirmationModalOpen}
        toggleModal={() => this.setState({ confirmationModalOpen: false })}
        objectName={this.state.readingOlympicsYear}
        handleConfirm={this.handleSubmit}
      />
    );
  };

  renderActiveYear = () => {
    let formValidationClassName = '';
    if (
      this.state.originalReadingOlympicsYear !== this.state.readingOlympicsYear
    ) {
      formValidationClassName = this.allowSubmitChangeYear()
        ? 'is-valid'
        : 'is-invalid';
    }
    return (
      <Form className="active-ro-year">
        {this.state.errors.map(({ message, key }) => {
          return (
            <Alert key={key} color="danger">
              {message}
            </Alert>
          );
        })}
        <FormGroup>
          <Label>Active Reading Olympics Year</Label>
          <Input
            type="text"
            name="readingOlympicsYear"
            className={'form-control ' + formValidationClassName}
            onChange={this.handleChange}
            maxLength="4"
            pattern="[0-9]{4}"
            required
            placeholder="Ex: 2018"
            value={this.state.readingOlympicsYear}
          />
          <FormText>
            Specify the active Reading Olympics year, which determines where the
            buttons on the{' '}
            <Link to="/ReadingOlympics">Reading Olympics main page</Link> go to.
          </FormText>
          <FormFeedback invalid="true">Please input a valid year.</FormFeedback>
        </FormGroup>
        <Button
          onClick={() => this.setState({ confirmationModalOpen: true })}
          disabled={!this.allowSubmitChangeYear()}
          color="warning"
        >
          Update active year
        </Button>
      </Form>
    );
  };

  render() {
    return (
      <Card>
        <CardBody>
          {this.state.success && (
            <Alert color="success">
              Successfully updated active year to{' '}
              {this.state.readingOlympicsYear}.
            </Alert>
          )}
          {this.renderConfirmationModal()}
          {this.renderActiveYear()}
        </CardBody>
      </Card>
    );
  }
}

export default AdminYearSection;
