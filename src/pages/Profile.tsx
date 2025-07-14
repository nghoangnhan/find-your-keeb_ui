import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import { Container, Typography, TextField, Button, Box, CircularProgress, Alert, MenuItem, Grid } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, parseISO } from 'date-fns';

const genderOptions = [
  { value: '', label: 'Unspecified' },
  { value: 'Male', label: 'Male' },
  { value: 'Female', label: 'Female' },
  { value: 'Other', label: 'Other' },
  { value: 'Prefer not to say', label: 'Prefer not to say' },
];

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<{ email: string; displayName: string; gender?: string; dateOfBirth?: string; address?: string; phoneNumber?: string } | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    apiService.getProfile()
      .then(data => {
        setProfile(data);
        setDisplayName(data.displayName || '');
        setGender(data.gender || '');
        setDateOfBirth(data.dateOfBirth ? parseISO(data.dateOfBirth) : null);
        setAddress(data.address || '');
        setPhoneNumber(data.phoneNumber || '');
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load profile');
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const dobString = dateOfBirth ? format(dateOfBirth, 'yyyy-MM-dd') : undefined;
      const updated = await apiService.updateProfile({ displayName, gender, dateOfBirth: dobString, address, phoneNumber });
      setProfile(updated);
      setSuccess(true);
    } catch {
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>My Profile</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>Profile updated!</Alert>}
      <form onSubmit={handleSave}>
        <TextField
          label="Email"
          value={profile?.email || ''}
          fullWidth
          margin="normal"
          InputProps={{ readOnly: true }}
        />
        <TextField
          label="Display Name"
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                label="Gender"
                value={gender}
                onChange={e => setGender(e.target.value)}
                fullWidth
                margin="normal"
              >
                {genderOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Date of Birth"
                  value={dateOfBirth}
                  onChange={date => setDateOfBirth(date)}
                  format="dd/MM/yyyy"
                  slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Box>
        <TextField
          label="Phone Number"
          value={phoneNumber}
          onChange={e => setPhoneNumber(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Address"
          value={address}
          onChange={e => setAddress(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          minRows={3}
        />
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button type="submit" variant="contained" color="primary" disabled={saving}>
            {saving ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default Profile; 