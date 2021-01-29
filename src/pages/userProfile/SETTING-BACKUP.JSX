import React, { useState } from "react";
import { FormFieldInput } from "../../components/FormFields";
import ProfileLayout from "./ProfileLayout";
import iconShowPassword from "./../../assets/images/icon-showHide-password.png";
import { Formik } from "formik";

import * as Yup from "yup";

const ProfileSetting = () => {
	const [showPassword, setShowPassword] = useState(false);

	const Schema = Yup.object().shape({
		password: Yup.string().required("This field is required"),
		changepassword: Yup.string().when("password", {
			is: (val) => (val && val.length > 0 ? true : false),
			then: Yup.string().oneOf(
				[Yup.ref("password")],
				"Both password need to be the same",
			),
		}),
	});

	return (
		<ProfileLayout>
			{/*<Formik
      initialValues={{
        password: "",
        changepassword: ""
      }}
      validationSchema={Schema}
      onSubmit={() => {}}
    >
      {({ values, errors, handleSubmit, handleChange, handleBlur }) => {
        return (
          <form onSubmit={handleSubmit}>
            <label for="passowrd">Password</label>
            <input
              type="password"
              name="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
            />
            <span class="error" style={{ color: "red" }}>
              {errors.password}
            </span>

            <label for="passowrd">Confirm Password</label>
            <input
              type="password"
              name="changepassword"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.changepassword}
            />
            <span class="error" style={{ color: "red" }}>
              {errors.changepassword}
            </span>
          </form>
        );
      }}
    </Formik>*/}

			<div className="profile-setting col-wrapper ">
				<div className="profile-setting__form col-item col-item--lg-6 padding-r-30">
					<h3 className="heading-tertiary"> Change Your Password</h3>
					<form className="utl-form">
						<FormFieldInput
							type="password"
							label="Old Password"
							placeholder="enter old password"
							id="old-password"
						/>

						<FormFieldInput
							type="password"
							label="New Password"
							placeholder="enter new password"
							id="new-password"
						/>
						<FormFieldInput
							type="password"
							label="Confirm New Password"
							placeholder="enter confirm password"
							id="new-password-confirm"
						/>
						<div className="form-group">
							<button className="utl-btn utl-btn-primary" type="submit">
								Change my Password
							</button>
						</div>
					</form>
				</div>
				<ul className="profile-setting__pass-info col-item col-item--lg-6 padding-l-10">
					<h3 className="heading-tertiary"> Password must contain:</h3>
					<li> Atleast 1 uppercase letter (A-Z)</li>
					<li>Atleast 1 upper case letter (0-9)</li>
					<li>Atleast 8 characters</li>
				</ul>
			</div>
		</ProfileLayout>
	);
};

export default ProfileSetting;
