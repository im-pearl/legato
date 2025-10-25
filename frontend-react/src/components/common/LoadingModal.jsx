import { Backdrop, Box, CircularProgress, Paper, Typography } from '@mui/material';

function LoadingModal({ isVisible = false, message = '잠시만 기다려주세요...' }) {
  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1000,
        backdropFilter: 'blur(4px)',
      }}
      open={isVisible}
    >
      <Paper
        elevation={10}
        sx={{
          p: 5,
          borderRadius: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          maxWidth: 400,
          width: '90%',
          animation: 'fadeIn 0.3s ease',
          '@keyframes fadeIn': {
            from: {
              opacity: 0,
              transform: 'translateY(-10px)',
            },
            to: {
              opacity: 1,
              transform: 'translateY(0)',
            },
          },
        }}
      >
        <CircularProgress
          size={60}
          thickness={4}
          sx={{
            color: 'primary.main',
          }}
        />
        <Typography
          variant="body1"
          color="text.primary"
          textAlign="center"
          fontWeight={500}
          sx={{ lineHeight: 1.5 }}
        >
          {message}
        </Typography>
      </Paper>
    </Backdrop>
  );
}

export default LoadingModal;

