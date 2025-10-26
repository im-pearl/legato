import { Box, Typography, Chip } from '@mui/material';

function AppHeader({ caseNumber, caseTitle }) {
  return (
    <Box
      component="header"
      sx={{
        height: 56,
        bgcolor: 'white',
        borderBottom: 1,
        borderColor: 'grey.200',
        display: 'flex',
        alignItems: 'center',
        px: 3,
        gap: 1.5,
        flexShrink: 0,
      }}
    >
      <Chip
        label={`${caseNumber}번 신청`}
        size="small"
        sx={{
          bgcolor: 'primary.50',
          color: 'primary.700',
          fontWeight: 600,
          fontSize: '0.875rem',
          height: 28,
        }}
      />
      <Typography
        variant="body1"
        sx={{
          fontWeight: 500,
          color: 'grey.800',
        }}
      >
        {caseTitle}
      </Typography>
    </Box>
  );
}

export default AppHeader;

