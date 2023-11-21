import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Autocomplete, TextField, Box, Typography, Chip } from '@mui/material';
import {
  useLocalization,
  useTranslation,
} from '../common/components/LocalizationProvider';
import { makeStyles } from '@mui/styles';
import { debounce } from '@mui/material/utils';
import usePersistedState from '../common/util/usePersistedState';

const useStyles = makeStyles((theme) => ({
  input: {
    flexBasis: '300px',
    flexGrow: 1,
    '& .MuiFormLabel-root': {
      top: '8%',
    },
    '& .MuiInputBase-root': {
      minHeight: '50px',
    },
  },
}));

const getTranslatedTitle = (option, locale) => {
  return (option?.[`title_${locale}`] || option?.title) ?? '';
};

const FilterBar = ({ onChange, onBadgeCountChange }) => {
  const classes = useStyles();
  const t = useTranslation();
  const { language } = useLocalization();
  const [filter, setFilter] = usePersistedState('filter', {
    'informationSeal.statusEns': [],
    transportationStatus: [],
    transportationNumber: '',
    'declaration.transportationVehicle.plateNo': '',
    'seals.numberEns': '',
    'declaration.registrationNumberTd': '',
  });

  const deviceStatuses = useSelector(
    (state) => state.dictionaries.deviceStatuses
  );

  const transportationStatuses = useSelector(
    (state) => state.dictionaries.transportationStatuses
  );

  const handleFilterDebounce = useCallback(
    debounce((updatedValue) => onChange(updatedValue), 500),
    []
  );

  const handleFilter = (key, value, debounce = false) => {
    setFilter((prev) => {
      const updatedValue = {
        ...prev,
        [key]: value,
      };

      if (debounce && onChange) {
        handleFilterDebounce(updatedValue);
      }
      if (!debounce && onChange) {
        onChange(updatedValue);
      }
      return updatedValue;
    });
  };

  const autocompleteList = [
    {
      name: 'axelorTransportationStatus',
      filterField: 'transportationStatus',
      options: transportationStatuses,
    },
    {
      name: 'axelorStatusEns',
      filterField: 'informationSeal.statusEns',
      options: deviceStatuses,
    },
  ];

  const inputList = [
    {
      name: 'axelorTransportationNumber',
      filterField: 'transportationNumber',
    },
    {
      name: 'axelorDeclarationTransportationVehiclePlateNo',
      filterField: 'declaration.transportationVehicle.plateNo',
    },
    {
      name: 'axelorNumberEns',
      filterField: 'seals.numberEns',
    },
    {
      name: 'axelorRegistrationNumber',
      filterField: 'declaration.registrationNumberTd',
    },
  ];

  useEffect(() => {
    if (onBadgeCountChange) {
      let count = 0;
      Object.values(filter).map(([value]) => {
        if (!!value || value?.length < 1) {
          count++;
        }
      });
      onBadgeCountChange(count);
    }
  }, [onBadgeCountChange, filter]);

  return (
    <>
      {autocompleteList.map(({ name, options, filterField }, index) => (
        <Autocomplete
          key={index}
          multiple
          className={classes.input}
          options={options}
          getOptionLabel={(option) => getTranslatedTitle(option, language)}
          renderTags={(value, getTagProps) => {
            const numTags = value.length;
            const limitTags = 1;
            return (
              <>
                {value.slice(0, limitTags).map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={index}
                    label={getTranslatedTitle(option, language)}
                  />
                ))}

                {numTags > limitTags &&
                  ` +${numTags - limitTags} ${t('axelorMore')}`}
              </>
            );
          }}
          value={filter[filterField]}
          onChange={(_, value) => handleFilter(filterField, value)}
          // eslint-disable-next-line react/jsx-props-no-spreading
          renderInput={(params) => <TextField {...params} label={t(name)} />}
        />
      ))}

      {inputList.map(({ name, filterField }, index) => (
        <TextField
          key={index}
          value={filter[filterField]}
          label={t(name)}
          className={classes.input}
          onChange={(e) => handleFilter(filterField, e.target.value, true)}
        />
      ))}
    </>
  );
};

export default FilterBar;
