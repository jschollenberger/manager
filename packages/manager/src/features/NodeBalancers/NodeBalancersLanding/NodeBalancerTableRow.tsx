import { NodeBalancerWithConfigs } from '@linode/api-v4/lib/nodebalancers';
import * as React from 'react';
import { Link } from 'react-router-dom';
import Hidden from 'src/components/core/Hidden';
import { makeStyles, Theme } from 'src/components/core/styles';
import TableCell from 'src/components/TableCell';
import TableRow from 'src/components/TableRow';
import IPAddress from 'src/features/linodes/LinodesLanding/IPAddress';
import RegionIndicator from 'src/features/linodes/LinodesLanding/RegionIndicator';
import { convertMegabytesTo } from 'src/utilities/unitConversions';
import NodeBalancerActionMenu from './NodeBalancerActionMenu';

const useStyles = makeStyles((theme: Theme) => ({
  // @todo: temporary measure that will cause scroll for the 'Name' and 'Backend Status'
  // column until we implement a hideOnTablet prop for EntityTables to prevent the
  // ActionCell from being misaligned
  labelWrapper: {
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    whiteSpace: 'nowrap',
  },
  statusWrapper: {
    whiteSpace: 'nowrap',
  },
  portLink: {
    color: theme.cmrTextColors.linkActiveLight,
  },
  link: {
    display: 'block',
    color: theme.cmrTextColors.linkActiveLight,
    lineHeight: '1.125rem',
    '&:hover, &:focus': {
      textDecoration: 'underline',
    },
  },
  ipsWrapper: {
    display: 'inline-flex',
    flexDirection: 'column',
    '& [data-qa-copy-ip]': {
      opacity: 0,
    },
  },
  row: {
    '&:hover': {
      '& [data-qa-copy-ip]': {
        opacity: 1,
      },
    },
  },
}));

interface Props {
  toggleDialog: (id: number, label: string) => void;
}

type CombinedProps = NodeBalancerWithConfigs & Props;

const NodeBalancerTableRow: React.FC<CombinedProps> = (props) => {
  const classes = useStyles();
  const { id, label, configs, transfer, ipv4, region, toggleDialog } = props;

  const nodesUp = configs.reduce(
    (result, config) => config.nodes_status.up + result,
    0
  );
  const nodesDown = configs.reduce(
    (result, config) => config.nodes_status.down + result,
    0
  );

  return (
    <TableRow
      key={id}
      data-qa-nodebalancer-cell={label}
      className={`${classes.row} fade-in-table`}
      ariaLabel={label}
    >
      <TableCell data-qa-nodebalancer-label>
        <div className={classes.labelWrapper}>
          <Link
            to={`/nodebalancers/${id}`}
            tabIndex={0}
            className={classes.link}
          >
            {label}
          </Link>
        </div>
      </TableCell>

      <Hidden xsDown>
        <TableCell data-qa-node-status className={classes.statusWrapper}>
          <span>{nodesUp} up</span> - <span>{nodesDown} down</span>
        </TableCell>
      </Hidden>
      <Hidden smDown>
        <TableCell data-qa-transferred>
          {convertMegabytesTo(transfer.total)}
        </TableCell>

        <TableCell data-qa-ports>
          {configs.length === 0 && 'None'}
          {configs.map(({ port, id: configId }, i) => (
            <React.Fragment key={configId}>
              <Link
                to={`/nodebalancers/${id}/configurations/${configId}`}
                className={classes.portLink}
              >
                {port}
              </Link>
              {i < configs.length - 1 ? ', ' : ''}
            </React.Fragment>
          ))}
        </TableCell>
      </Hidden>

      <TableCell data-qa-nodebalancer-ips>
        <div className={classes.ipsWrapper}>
          <IPAddress ips={[ipv4]} copyRight showMore />
        </div>
      </TableCell>
      <Hidden xsDown>
        <TableCell data-qa-region>
          <RegionIndicator region={region} />
        </TableCell>
      </Hidden>

      <TableCell actionCell>
        <NodeBalancerActionMenu
          nodeBalancerId={id}
          toggleDialog={toggleDialog}
          label={label}
        />
      </TableCell>
    </TableRow>
  );
};

export default NodeBalancerTableRow;
