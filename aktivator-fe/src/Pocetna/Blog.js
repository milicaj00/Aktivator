import { Button, ButtonGroup, FormControl, Grid, InputLabel, MenuItem, Select, Card, CardActionArea, CardMedia, CardContent, Typography, Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useState, useEffect } from 'react';
import { GetData } from '../komponente/Fetch';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";

const PUTANJA = 'http://localhost:8800/'

const Blog = () => {

    let navigate = useNavigate()

    const [nizBlogova, setBlogovi] = useState([])
    const [greska, setGreska] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const [naslov, setNaslov] = useState('Zdravlje')

    useEffect(() => {
        GetData("http://localhost:8800/api/blog/VratiBlogTag/" + naslov, setBlogovi, setGreska, setIsLoading)
    }, [naslov])

    return (
        <Box className="cardCenter marginS">

            <ToggleButtonGroup
                exclusive
                fullWidth
                onChange={(ev) => { setNaslov(ev.target.value) }}
                value={naslov}
                sx={{ display: { xs: 'none', sm: 'flex', md: 'flex' }, justifyContent: 'space-around', mb: '5%' }}>
                <ToggleButton value='Zdravlje' color='primary'>Zdravlje</ToggleButton>
                <ToggleButton value='Ishrana' color='primary' >Ishrana</ToggleButton>
                <ToggleButton value='Trening' color='primary'>Trening</ToggleButton>
                <ToggleButton value='Fitness' color='primary'>Fitnes</ToggleButton>
            </ToggleButtonGroup>
            <FormControl focused fullWidth sx={{ maxWidth: 345, display: { xs: 'flex', sm: 'none' }, mb: '5%' }}>
                <Select
                    onChange={(ev) => { setNaslov(ev.target.value) }}
                    value={naslov}
                >
                    <MenuItem value='Zdravlje'>Zdravlje</MenuItem>
                    <MenuItem value='Ishrana'>Ishrana</MenuItem>
                    <MenuItem value='Trening'>Trening</MenuItem>
                    <MenuItem value='Fitness'>Fitness</MenuItem>
                </Select>
            </FormControl>

            {isLoading && <CircularProgress size='2rem' disableShrink />}

            {/* <Typography variant="h4" component="div" sx ={{margin: '2% 0%', display:{xs:'none', md:'block'}}}>{naslov}</Typography> */}

            {greska && <p className='greska'>Doslo je do greske</p>}

            <Grid container className='blogovi' spacing={2} justify="flex-start"
                alignItems="flex-start">
                {nizBlogova
                    .map((usl, i) => (
                        <Grid key={i} item xs={12} sm={6} md={4}
                            className='cardCenter'
                            onClick={() => {
                                navigate(`/blog/${usl.tagovi}/${usl.naslov}`, { state: usl });
                            }}>

                            <Card className="blog" sx={{ maxWidth: 345 }} >
                                <CardActionArea>
                                    <CardMedia
                                        component="img"
                                        // image={usl.slika}
                                        crossOrigin="anonymous"
                                        src={PUTANJA + usl.slika}
                                        alt={usl.naslov}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {usl.naslov}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {usl.kratakopis}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
            </Grid>
        </Box >
    )

}

export default Blog