import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";


const AppBarComponent = () => {
  return (
    <AppBar position="static" sx={{ minWidth: "100%" }}>
      <Container sx={{ minWidth: "100%" }}>
        <Toolbar disableGutters sx={{
          minWidth: "100%", justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Some logo
          </Typography>

        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default AppBarComponent;