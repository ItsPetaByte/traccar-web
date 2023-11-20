import ReplayIcon from '@mui/icons-material/Replay';
import React from 'react';
import { useSelector } from 'react-redux';
import Draggable from 'react-draggable';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableRow,
  TableCell,
  CardMedia,
  CardActions,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import CloseIcon from '@mui/icons-material/Close';
import LaunchIcon from '@mui/icons-material/Launch';
import { useNavigate } from 'react-router-dom';

import {
  useLocalization,
  useTranslation,
} from '../common/components/LocalizationProvider';
import useDeviceAttributes from '../common/attributes/useDeviceAttributes';

const getStatus = (arr, value, locale) => {
  const finded = arr.find((item) => item?.value == value);
  if (finded == null) return '';
  return (finded?.[`title_${locale}`] || finded?.title) ?? '';
};

const useStyles = makeStyles((theme) => ({
  card: {
    pointerEvents: 'auto',
    width: theme.dimensions.popupMaxWidth,
  },
  media: {
    height: theme.dimensions.popupImageHeight,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  mediaButton: {
    color: theme.palette.primary.contrastText,
    mixBlendMode: 'difference',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1, 1, 0, 2),
  },
  content: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    maxHeight: theme.dimensions.cardContentMaxHeight,
    overflow: 'auto',
  },
  delete: {
    color: theme.palette.error.main,
  },
  icon: {
    width: '25px',
    height: '25px',
    filter: 'brightness(0) invert(1)',
  },
  table: {
    '& .MuiTableCell-sizeSmall': {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cell: {
    maxWidth: '200px',
    borderBottom: 'none',
  },
  root: {
    pointerEvents: 'none',
    position: 'fixed',
    zIndex: 5,
    left: '50%',
    bottom: theme.spacing(3),
    transform: 'translateX(-50%)',
  },
}));

const StatusRow = ({ name, content }) => {
  const classes = useStyles();

  return (
    <TableRow className={classes.row}>
      <TableCell className={classes.cell}>
        <Typography variant='body2'>{name}</Typography>
      </TableCell>
      <TableCell className={classes.cell}>
        <Typography variant='body2' color='textSecondary'>
          {content}
        </Typography>
      </TableCell>
    </TableRow>
  );
};

const StatusCard = ({ deviceId, position, onClose }) => {
  const classes = useStyles();
  const t = useTranslation();
  const { language } = useLocalization();

  const device = useSelector((state) => state.devices.items[deviceId]);
  const transportationStatuses = useSelector(
    (state) => state.dictionaries.transportationStatuses
  );

  const deviceStatuses = useSelector(
    (state) => state.dictionaries.deviceStatuses
  );

  const deviceImage = device?.attributes?.deviceImage;

  const deviceAttributes = useDeviceAttributes(t);
  const deviceItems =
    'transportationNumber,transportationStatus,seals.numberEns,informationSeal.statusEns,informationSeal.alarm,seals.positionsId.batteryLevel,informationSeal.dateTimeActivation,informationSeal.dateTimeDeactivation,declaration.customsDeparture.name,declaration.customsDestination.name,phoneNumberDriver,declaration.transportationVehicle.plateNo';

  const navigate = useNavigate();

  const getDeviceValue = (device, key) => {
    const statuses = {
      'informationSeal.statusEns': getStatus(
        deviceStatuses,
        device[key],
        language
      ),
      transportationStatus: getStatus(
        transportationStatuses,
        device[key],
        language
      ),
    };

    return statuses.hasOwnProperty(key) ? statuses[key] : device?.[key] ?? '';
  };

  return (
    <div className={classes.root}>
      {device && (
        <Draggable handle={`.${classes.media}, .${classes.header}`}>
          <Card elevation={3} className={classes.card}>
            {deviceImage ? (
              <CardMedia
                className={classes.media}
                image={`/api/media/${device.uniqueId}/${deviceImage}`}
              >
                <IconButton
                  size='small'
                  onClick={onClose}
                  onTouchStart={onClose}
                >
                  <CloseIcon fontSize='small' className={classes.mediaButton} />
                </IconButton>
              </CardMedia>
            ) : (
              <div className={classes.header}>
                <Typography variant='body2' color='textSecondary'>
                  {device?.['seals.numberEns'] ?? ''}
                </Typography>
                <IconButton
                  size='small'
                  onClick={onClose}
                  onTouchStart={onClose}
                >
                  <CloseIcon fontSize='small' />
                </IconButton>
              </div>
            )}

            <CardContent className={classes.content}>
              <Table size='small' classes={{ root: classes.table }}>
                <TableBody>
                  {device &&
                    deviceItems
                      .split(',')
                      .filter((key) => device.hasOwnProperty(key))
                      .map((key) => (
                        <StatusRow
                          key={key}
                          name={
                            deviceAttributes.hasOwnProperty(key)
                              ? deviceAttributes[key].name
                              : key
                          }
                          content={getDeviceValue(device, key)}
                        />
                      ))}
                </TableBody>
              </Table>
            </CardContent>

            <CardActions classes={{ root: classes.actions }} disableSpacing>
              <IconButton
                onClick={() => navigate('/replay')}
                // disabled={disableActions || !position}
              >
                <ReplayIcon />
              </IconButton>

              {device.tripId && (
                <IconButton
                  onClick={() => {
                    window.open(
                      `https://${
                        import.meta.env.APP_AXE_DOMAIN
                      }/#/ds/ens.transportation-trip.action-view/edit/${
                        device.tripId
                      }`
                    );
                    onClose();
                  }}
                >
                  <LaunchIcon />
                </IconButton>
              )}
            </CardActions>
          </Card>
        </Draggable>
      )}
    </div>
  );
};

export default StatusCard;
