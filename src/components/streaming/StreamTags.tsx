import { Box, Chip } from "@mui/material";
import {
    Home, ChildCare, People, Chair, Landscape, LocalFireDepartment, Pets
} from '@mui/icons-material';

const getIconForTag = (tag) => {
  switch (tag.toLowerCase()) {
    case 'interior': return <Home />;
    case 'bebe': return <ChildCare />;
    case 'personas': return <People />;
    case 'muebles': return <Chair />;
    case 'exterior': return <Landscape />;
    case 'fuego': return <LocalFireDepartment />;
    case 'mascotas': return <Pets />;
    default: return null;
  }
};

const StreamTags = ({ tags }) => {
  if (!tags || tags.length === 0) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 1,
        mt: 1,
        mb: 2,
        p: 4,
        justifyContent: { xs: 'center', md: 'flex-start' },
      }}
    >
      {tags.map((tag, index) => {
        const icon = getIconForTag(tag);
        return (
          <Chip
            key={index}
            label={tag}
            icon={icon ?? undefined}
            sx={{
              px: 0.5,
              border: "1px solid #212529",
              background: "#a0a7ae",
              fontWeight: 500,
              marginRight: "6px",
              '& .MuiChip-icon': {
                color: "#212529",
              }
            }}
          />
        );
      })}
    </Box>
  );
};

export default StreamTags;
