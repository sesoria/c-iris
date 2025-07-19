import {
  Typography,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Box,
  LinearProgress,
  Avatar,
  Paper,
  IconButton,
  Tooltip,
  Fade
} from "@mui/material";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from "@mui/lab";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import { timelineItemClasses } from "@mui/lab/TimelineItem";
import { useSelector } from "react-redux";
import { useState } from "react";
import { selectDetections } from "../../slices/detectionsSlice";

const getCategoryIcon = (category) => {
  switch (category) {
    case 'Neighborhood': return '🏘️';
    case 'City': return '🌆';
    case 'Person': return '👤';
    case 'Car': return '🚗';
    case 'Road': return '🛣️';
    default: return '🔍';
  }
};

const getConfidenceColor = (confidence) => {
  if (confidence >= 90) return 'green';
  if (confidence >= 70) return 'orange';
  return 'red';
};

const LogsTimeline = ({ streamName }) => {
  const detections = useSelector(selectDetections);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const logs = detections.streams[streamName]?.slice(0, 10) || [];

  const toggleExpanded = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <Box sx={{ padding: 1 }}>
      <Timeline
        sx={{
          [`& .${timelineItemClasses.root}:before`]: { flex: 0, padding: 0 },
        }}
      >
        {logs.map((log, index) => (
          <TimelineItem key={index} sx={{ alignItems: "center" }}>
          <TimelineSeparator>
            <TimelineDot color="primary" />
            {index < logs.length - 1 && (
              <TimelineConnector sx={{ flexGrow: 1, minHeight: 40 , backgroundColor: 'primary.main'}} />
            )}
          </TimelineSeparator>
            <TimelineContent sx={{ py: '12px' }}>
              <Fade in timeout={400}>
                <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1">
                      {new Date(log.timestamp * 1000).toLocaleString()}
                    </Typography>
                    <Tooltip title={expandedIndex === index ? "Ocultar detalles" : "Mostrar detalles"}>
                      <IconButton size="small" onClick={() => toggleExpanded(index)}>
                        {expandedIndex === index ? <ExpandLess /> : <ExpandMore />}
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                    {log.labels.length} detecciones: {log.labels.map(l => l.Name).join(', ')}
                  </Typography>

                  <Collapse in={expandedIndex === index}>
                    <List dense>
                      {log.labels.map((label, idx) => (
                        <ListItem key={idx} sx={{ pl: 0 }}>
                          <Avatar
                            sx={{
                              bgcolor: getConfidenceColor(label.Confidence),
                              width: 32, height: 32,
                              fontSize: 16, mr: 1
                            }}
                          >
                            {getCategoryIcon(label.Name)}
                          </Avatar>
                          <ListItemText
                            primary={label.Name}
                            secondary={`Confianza: ${label.Confidence.toFixed(2)}%`}
                          />
                          <Box sx={{ width: '50%' }}>
                            <LinearProgress
                              variant="determinate"
                              value={label.Confidence}
                              sx={{
                                height: 6,
                                borderRadius: 2,
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: getConfidenceColor(label.Confidence),
                                }
                              }}
                            />
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </Paper>
              </Fade>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Box>
  );
};

export default LogsTimeline;
