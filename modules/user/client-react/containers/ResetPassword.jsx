import React from 'react';
import { graphql, compose } from 'react-apollo';
import { translate } from '@module/i18n-client-react';
import { formikMessageHandler } from '@module/core-client-react';

import ResetPasswordView from '../components/ResetPasswordView';
import RESET_PASSWORD from '../graphql/ResetPassword.graphql';

class ResetPassword extends React.Component {
  onSubmit = async values => {
    const { t, resetPassword, history, handleError } = this.props;

    await handleError(
      () => resetPassword({ ...values, token: this.props.match.params.token }),
      t('resetPass.errorMsg')
    );

    history.push('/login');
  };

  render() {
    return <ResetPasswordView {...this.props} onSubmit={this.onSubmit} />;
  }
}

const ResetPasswordWithApollo = compose(
  translate('user'),
  formikMessageHandler,
  graphql(RESET_PASSWORD, {
    props: ({ mutate }) => ({
      resetPassword: async ({ password, passwordConfirmation, token }) => {
        try {
          const {
            data: { resetPassword }
          } = await mutate({
            variables: { input: { password, passwordConfirmation, token } }
          });

          return resetPassword;
        } catch (e) {
          console.log(e.graphQLErrors);
        }
      }
    })
  })
)(ResetPassword);

export default ResetPasswordWithApollo;
