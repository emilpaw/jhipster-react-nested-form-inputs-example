import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { isEmail, ValidatedField } from 'react-jhipster';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Col, Form, FormText, Row } from 'reactstrap';
import { createUser, getRoles, getUser, reset, updateUser } from './user-management.reducer';

export const UserManagementUpdate = (props: RouteComponentProps<{ login: string }>) => {
  const [isNew] = useState(!props.match.params || !props.match.params.login);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getUser(props.match.params.login));
    }
    dispatch(getRoles());
    return () => {
      dispatch(reset());
    };
  }, [props.match.params.login]);

  const handleClose = () => {
    props.history.push('/admin/user-management');
  };

  const saveUser = values => {
    if (isNew) {
      dispatch(createUser(values));
    } else {
      dispatch(updateUser(values));
    }
    handleClose();
  };

  const isInvalid = false;
  const user = useAppSelector(state => state.userManagement.user);
  const loading = useAppSelector(state => state.userManagement.loading);
  const updating = useAppSelector(state => state.userManagement.updating);
  const authorities = useAppSelector(state => state.userManagement.authorities);

  const {
    handleSubmit,
    register,
    reset: resetForm,
    formState: { errors },
  } = useForm({ mode: 'onTouched', defaultValues: user });

  useEffect(() => {
    resetForm(user);
  }, [reset, user]);

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h1>Create or edit a User</h1>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Form onSubmit={handleSubmit(saveUser)}>
              {user.id ? (
                <ValidatedField register={register} type="text" name="id" required readOnly label="ID" validate={{ required: true }} />
              ) : null}
              <ValidatedField
                register={register}
                error={errors?.login}
                type="text"
                name="login"
                label="Login"
                validate={{
                  required: {
                    value: true,
                    message: 'Your username is required.',
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$/,
                    message: 'Your username is invalid.',
                  },
                  minLength: {
                    value: 1,
                    message: 'Your username is required to be at least 1 character.',
                  },
                  maxLength: {
                    value: 50,
                    message: 'Your username cannot be longer than 50 characters.',
                  },
                }}
              />
              <Row>
                <Col md="6">
                  <ValidatedField
                    register={register}
                    error={errors?.firstName}
                    type="text"
                    name="firstName"
                    label="First name"
                    validate={{
                      maxLength: {
                        value: 50,
                        message: 'This field cannot be longer than 50 characters.',
                      },
                    }}
                  />
                </Col>
                <Col md="6">
                  <ValidatedField
                    register={register}
                    error={errors?.lastName}
                    type="text"
                    name="lastName"
                    label="Last name"
                    validate={{
                      maxLength: {
                        value: 50,
                        message: 'This field cannot be longer than 50 characters.',
                      },
                    }}
                  />
                </Col>
              </Row>
              <FormText>This field cannot be longer than 50 characters.</FormText>
              <ValidatedField
                register={register}
                error={errors?.email}
                name="email"
                label="Email"
                placeholder={'Your email'}
                type="email"
                validate={{
                  required: {
                    value: true,
                    message: 'Your email is required.',
                  },
                  minLength: {
                    value: 5,
                    message: 'Your email is required to be at least 5 characters.',
                  },
                  maxLength: {
                    value: 254,
                    message: 'Your email cannot be longer than 50 characters.',
                  },
                  validate: v => isEmail(v) || 'Your email is invalid.',
                }}
              />
              <ValidatedField
                register={register}
                error={errors?.activated}
                type="checkbox"
                name="activated"
                check
                value={true}
                disabled={!user.id}
                label="Activated"
              />
              <ValidatedField register={register} type="select" name="authorities" multiple label="Profiles">
                {authorities.map(role => (
                  <option value={role} key={role}>
                    {role}
                  </option>
                ))}
              </ValidatedField>
              <Button tag={Link} to="/admin/user-management" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">Back</span>
              </Button>
              &nbsp;
              <Button color="primary" type="submit" disabled={isInvalid || updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp; Save
              </Button>
            </Form>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default UserManagementUpdate;
