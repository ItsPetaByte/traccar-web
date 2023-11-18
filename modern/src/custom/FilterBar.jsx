import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { Autocomplete, TextField, Box } from '@mui/material';
import {
  useLocalization,
  useTranslation,
} from '../common/components/LocalizationProvider';
import { makeStyles } from '@mui/styles';
import { debounce } from '@mui/material/utils';

const useStyles = makeStyles((theme) => ({
  input: {
    minWidth: '300px',
    '& .MuiFormLabel-root': {
      top: '8%',
    },
    '& .MuiInputBase-root': {
      minHeight: '50px',
    },
  },
}));

const getTranslatedTitle = (option, locale) => {
  return option?.[`title_${locale}`] ?? option?.title ?? '';
};

const FilterBar = ({ onChange }) => {
  const classes = useStyles();
  const t = useTranslation();
  const { language } = useLocalization();
  const [filter, setFilter] = useState({
    deviceStatus: [],
    transportationStatus: [],
    transportationNumber: '',
    'declaration.transportationVehicle.plateNo': '',
  });

  const deviceStatuses = useSelector(
    (state) => state.dictionaries.deviceStatuses
  );

  const transportationStatuses = useSelector(
    (state) => state.dictionaries.transportationStatuses
  );

  const handleFilter = (key, value) => {
    setFilter((prev) => {
      const updatedValue = {
        ...prev,
        [key]: value,
      };

      if (onChange) onChange(updatedValue);
      return updatedValue;
    });
  };

  const autocompleteList = [
    {
      name: 'Статус поездки',
      filterField: 'transportationStatus',
      options: transportationStatuses,
    },
    {
      name: 'Статус пломбы',
      filterField: 'deviceStatus',
      options: deviceStatuses,
    },
  ];

  const inputList = [
    {
      name: 'Номер поездки',
      filterField: 'transportationNumber',
    },
    {
      name: 'Гос.номер АТС ',
      filterField: 'declaration.transportationVehicle.plateNo',
    },
  ];

  const handleFilterDebounce = useCallback(
    debounce((field, value) => handleFilter(field, value), 500),
    []
  );

  return (
    <Box display='flex' flexWrap='wrap' gap={1}>
      {autocompleteList.map(({ name, options, filterField }, index) => (
        <Autocomplete
          key={index}
          multiple
          className={classes.input}
          options={options}
          getOptionLabel={(option) => getTranslatedTitle(option, language)}
          value={filter[filterField]}
          onChange={(_, value) => handleFilter(filterField, value)}
          // eslint-disable-next-line react/jsx-props-no-spreading
          renderInput={(params) => <TextField {...params} label={name} />}
        />
      ))}

      {inputList.map(({ name, filterField }, index) => (
        <TextField
          key={index}
          label={name}
          className={classes.input}
          onChange={(e) => handleFilterDebounce(filterField, e.target.value)}
        />
      ))}
    </Box>
  );
};

export default FilterBar;
