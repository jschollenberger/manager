import * as React from 'react';
import ActionsPanel from 'src/components/ActionsPanel';
import Button from 'src/components/Button';
import ConfirmationDialog from 'src/components/ConfirmationDialog';
import Typography from 'src/components/core/Typography';
import { Engine, resetDatabaseCredentials } from '@linode/api-v4/lib/databases';
import { getAPIErrorOrDefault } from 'src/utilities/errorUtils';

interface Props {
  open: boolean;
  onClose: () => void;
  databaseID: number;
  databaseEngine: Engine;
}

// I feel like this pattern should be its own component due to how common it is
const renderActions = (
  onClose: () => void,
  onConfirm: () => void,
  loading: boolean
) => {
  return (
    <ActionsPanel>
      <Button
        buttonType="secondary"
        onClick={onClose}
        data-qa-cancel
        data-testid={'dialog-cancel'}
      >
        Cancel
      </Button>
      <Button
        buttonType="primary"
        onClick={onConfirm}
        data-qa-confirm
        data-testid="dialog-confrim"
        loading={loading}
      >
        Reset Password
      </Button>
    </ActionsPanel>
  );
};

export const DatabaseSettingsResetPasswordDialog: React.FC<Props> = (props) => {
  const { open, onClose, databaseEngine, databaseID } = props;

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const onResetRootPassword = async () => {
    setIsLoading(true);
    try {
      await resetDatabaseCredentials(databaseEngine, databaseID);
      setIsLoading(false);
      onClose();
    } catch (e) {
      setIsLoading(false);
      setError(
        getAPIErrorOrDefault(
          e,
          'There was an error resetting the root password'
        )[0].reason
      );
    }
  };

  return (
    <ConfirmationDialog
      open={open}
      title="Reset Root Password"
      onClose={onClose}
      actions={renderActions(onClose, onResetRootPassword, isLoading)}
      error={error}
    >
      <Typography>
        After resetting your Root Password, you can view your new password on
        the Database Cluster Summary page.
      </Typography>
    </ConfirmationDialog>
  );
};

export default DatabaseSettingsResetPasswordDialog;
