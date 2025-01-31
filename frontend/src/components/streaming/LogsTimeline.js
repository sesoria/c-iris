import { useEffect, useRef, useState } from 'react';
import { Typography, Collapse, List, ListItem, ListItemText, Box, LinearProgress, Avatar } from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';
import { timelineItemClasses } from '@mui/lab/TimelineItem';
import getRandomLabels from '../utils/getRandomLabels';
import { useSelector } from 'react-redux';
import { selectDetections } from "../../slices/detectionsSlice"; // Import your selector
const getCategoryIcon = (category) => {
  switch (category) {
    case 'Neighborhood':
      return '🏘️';
    case 'City':
      return '🌆';
    case 'Person':
      return '👤';
    case 'Car':
      return '🚗';
    case 'Road':
      return '🛣️';
    default:
      return '🔍';
  }
};

const getConfidenceColor = (confidence) => {
  if (confidence >= 90) return 'green';
  if (confidence >= 70) return 'orange';
  return 'red';
};

const LogsTimeline = () => {
  const [logs, setLogs] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [lastDetections, setLastDetections] = useState(null)
  const detections = useSelector(selectDetections);

  useEffect(() => {
      console.log("hola intentamos añadir un log")
      console.log(detections)
      if (detections.labels.length > 0) {
        const timestamp = new Date(detections.timestamp * 1000).toLocaleString();
        setLogs((prevLogs) => [{ timestamp, labels: detections.labels }, ...prevLogs]);
      }
  }, [detections]);
  
  // useEffect(() => {
  //     console.log("hola intentamos añadir un log")
  //     if (labelsRef.current && labelsRef.current.labels.length > 0) {
  //       if (lastDetections !== labelsRef.current){
  //         const timestamp = new Date(labelsRef.current.timestamp * 1000).toLocaleString();
  //         setLogs((prevLogs) => [...prevLogs, { timestamp, labels: labelsRef.current.labels }]);
  //         setLastDetections(labelsRef.current)
  //       }
  //     }
  // }, [labelsRef, lastDetections]);
  

  useEffect(() => {
    const interval = setInterval(() => {
      const newLogs = getRandomLabels().Labels;
      const timestamp = new Date().toLocaleString();
      setLogs((prevLogs) => [...prevLogs, { timestamp, labels: newLogs }]);
    }, 120000);

    return () => clearInterval(interval);
  }, []); // Este efecto solo se ejecuta una vez al montar el componente

  const handleChange = (index) => () => {
    setExpanded(expanded === index ? null : index);
  };

  const addLog = () => {
    const timestamp = new Date().toLocaleString();
    const exampleLog = {
      timestamp,
      labels: [
        { Name: 'Neighborhood', Confidence: 99.99 },
        { Name: 'City', Confidence: 99.98 },
        { Name: 'Person', Confidence: 98.77 }
      ]
    };
    setLogs((prevLogs) => [exampleLog, ...prevLogs]);
  };

  return (
    <div style={{ padding: '2px' }}>
      <button onClick={addLog}>Add Log</button>
      <Timeline sx={{
        [`& .${timelineItemClasses.root}:before`]: {
          flex: 0,
          padding: 0,
        },
      }}>
        {logs.map((log, index) => (
          <TimelineItem key={index}>
            <TimelineSeparator>
              <TimelineDot color="primary" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Box onClick={handleChange(index)} style={{ cursor: 'pointer' }}>
                <Typography variant="subtitle1">{log.timestamp}</Typography>
                <Collapse in={expanded === index}>
                  <List>
                    {log.labels.map((label, idx) => (
                      <ListItem key={idx} disableGutters>
                        <Avatar sx={{ bgcolor: getConfidenceColor(label.Confidence), marginRight: '5px' }}>
                          {getCategoryIcon(label.Name)}
                        </Avatar>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              noWrap
                              sx={{
                                maxWidth: '100px', // Limita el ancho del nombre
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {label.Name}
                            </Typography>
                          }
                        />
                        <Box display="flex" alignItems="center" gap={1} style={{ width: '50%' }}>
                          <LinearProgress
                            variant="determinate"
                            value={label.Confidence}
                            sx={{
                              width: '100%',
                              bgcolor: 'lightgray',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: getConfidenceColor(label.Confidence),
                              },
                            }}
                          />
                          <Typography variant="body2" color="textSecondary">
                            {label.Confidence.toFixed(2)}%
                          </Typography>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </Box>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </div>
  );
};

export default LogsTimeline;
