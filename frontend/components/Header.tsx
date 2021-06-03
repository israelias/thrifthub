import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { Container } from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Link from 'next/link';
import { Category } from '../interfaces';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appbarDesktop: {
    backgroundColor: '#f8f8f8',
    color: '#fff',
  },
  appbarMain: {
    backgroundColor: '#2d2d2d',
  },
  appbarSecondary: {
    backgroundColor: '#525050',
    color: '#fff',
  },
  appbarPromotion: {
    backgroundColor: '#2d2d2d',
    color: '#fff',
    margin: theme.spacing(0, 0, 8),
    ['@media (max-width:600px)']: {
      margin: theme.spacing(0, 0, 2),
    },
  },
  toolbarDesktop: {
    padding: '0px',
    minHeight: 30,
  },
  toolbarMain: {
    padding: '0px',
    minHeight: 60,
  },
  toolbarSecondary: {
    padding: '0px',
    minHeight: 50,
  },
  toolbarPromotion: {
    padding: '0px',
    minHeight: 50,
  },
  svg: {
    fill: '#fff',
  },
  menuList: {
    display: 'flex',
    flexDirection: 'row',
    padding: '0',
  },
  menuListItem: {
    padding: 0,
    paddingRight: 20,
    textTransform: 'capitalize',
  },
  listItemLink: {
    fontSize: 13,
    color: '#fff',
    textDecoration: 'none',
  },
}));

type Props = {
  categories: Category[];
};

function Header({ categories }: Props) {
  const classes = useStyles();

  return (
    <nav>
      <AppBar
        position="relative"
        elevation={0}
        className={classes.appbarDesktop}
      >
        <Container maxWidth="lg">
          <Toolbar className={classes.toolbarDesktop}></Toolbar>
        </Container>
      </AppBar>
      <AppBar
        position="static"
        elevation={0}
        className={classes.appbarMain}
      >
        <Container maxWidth="lg">
          <Toolbar className={classes.toolbarMain}>
            <Link href={`/`}>
              <a>
                <svg
                  className={classes.svg}
                  xmlns="http://www.w3.org/2000/svg"
                  width="120"
                  height="50"
                  viewBox="0 0 476 140"
                >
                  <path
                    id="ASHOP"
                    d="M87.266,127h24.922L69.609,13.25H47.891L5.547,127H30.469l7.812-23.438H79.375ZM58.75,42l14.3,42.578H44.609Zm100.759,64.648q-4.687,3.4-13.046,3.4-22.5,0-22.5-18.828H100.447a33.706,33.706,0,0,0,5.664,19.375q5.664,8.36,16.445,13.164a58.089,58.089,0,0,0,23.907,4.8q18.9,0,30.078-8.4T187.713,97a29.717,29.717,0,0,0-9.141-22.187q-9.141-8.906-29.141-14.922-10.86-3.281-16.445-7.031t-5.586-9.3a11.458,11.458,0,0,1,4.766-9.57q4.764-3.633,13.359-3.633,8.907,0,13.828,4.336t4.922,12.148h23.438a32.606,32.606,0,0,0-5.274-18.281A34.6,34.6,0,0,0,167.634,16.1a51.133,51.133,0,0,0-21.718-4.414A56.174,56.174,0,0,0,124.08,15.75q-9.728,4.063-14.922,11.289a27.461,27.461,0,0,0-5.2,16.445q0,17.736,19.375,28.2a119.438,119.438,0,0,0,19.3,7.773q12.188,3.946,16.875,7.5t4.688,10.2A11.055,11.055,0,0,1,159.509,106.648ZM278.55,13.25H255.113V59.344h-45.7V13.25H185.972V127h23.437V78.25h45.7V127H278.55V13.25Zm96.306,54.375q0-16.717-6.054-29.492a45.089,45.089,0,0,0-17.11-19.609,50.138,50.138,0,0,0-50.547,0,45.08,45.08,0,0,0-17.109,19.609q-6.055,12.773-6.055,29.57v5.625q0.078,16.406,6.172,29.024a45.158,45.158,0,0,0,17.188,19.414,50.216,50.216,0,0,0,50.586-.078,44.722,44.722,0,0,0,16.992-19.532Q374.855,89.5,374.856,72.7V67.625Zm-23.75,5.469q-0.078,17.736-6.406,26.992t-18.125,9.258q-12.031,0-18.437-9.61T301.731,72.7V67.156q0.078-17.734,6.485-26.914t18.2-9.18q11.874,0,18.281,9.3t6.406,27.187v5.547Zm67.166,13.828q20.234,0,31.68-9.648T461.4,50.906a37.156,37.156,0,0,0-5.234-19.648A34.552,34.552,0,0,0,441.2,17.938a51.344,51.344,0,0,0-22.539-4.687H374.288V127h23.437V86.922h20.547ZM397.725,32.234h21.484q8.673,0.157,13.594,5.313t4.922,13.516q0,8.126-4.883,12.5t-14.179,4.375H397.725v-35.7Z"
                  />
                </svg>
              </a>
            </Link>
          </Toolbar>
        </Container>
      </AppBar>
      <AppBar
        position="relative"
        elevation={0}
        className={classes.appbarSecondary}
      >
        <Container maxWidth="lg">
          <Toolbar className={classes.toolbarSecondary}>
            <List className={classes.menuList}>
              {categories.map((category) => (
                <ListItem
                  key={category.name}
                  className={classes.menuListItem}
                >
                  <Link
                    href={`/category/${encodeURIComponent(
                      category.slug
                    )}`}
                  >
                    <a className={classes.listItemLink}>
                      {category.name}
                    </a>
                  </Link>
                </ListItem>
              ))}
            </List>
          </Toolbar>
        </Container>
      </AppBar>
      <AppBar
        position="relative"
        elevation={0}
        className={classes.appbarPromotion}
      >
        <Container maxWidth="lg">
          <Toolbar className={classes.toolbarPromotion}></Toolbar>
        </Container>
      </AppBar>
    </nav>
  );
}

export default Header;
