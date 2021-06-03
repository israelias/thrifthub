import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import CardMedia from '@material-ui/core/CardMedia';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Link from 'next/link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import Layout from '../components/Layout';
import Header from '../components/Header';

import { Product, Category } from '../interfaces';

const useStyles = makeStyles((theme) => ({
  example: {
    color: '#ccc',
  },
  cardGrid: {
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '0',
  },
  cardMedia: {
    paddingTop: '140%',
  },
}));

type Props = {
  posts: Product[];
  categories: Category[];
};

const Home = ({ posts, categories }: Props) => {
  const classes = useStyles();
  return (
    <>
      <Header categories={categories} />
      <main>
        <Container className={classes.cardGrid} maxWidth="lg">
          <Grid container spacing={2}>
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`product/${encodeURIComponent(post.slug)}`}
              >
                <Grid item xs={6} sm={4} md={3}>
                  <Card className={classes.card} elevation={0}>
                    <CardMedia
                      className={classes.cardMedia}
                      // component="img"
                      image={post.product_image[0].image}
                      title="Image title"
                      // alt={post.product_image[0].alt_text}
                    />
                    <CardContent>
                      <Typography gutterBottom component="p">
                        {post.title}
                      </Typography>
                      <Box
                        component="p"
                        fontSize={16}
                        fontWeight={900}
                      >
                        £{post.regular_price}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Link>
            ))}
          </Grid>
        </Container>
      </main>
    </>
  );
};

export async function getStaticProps() {
  const res = await fetch('http://127.0.0.1:8000/api/');
  const posts = await res.json();

  const ress = await fetch('http://127.0.0.1:8000/api/category/');
  const categories = await ress.json();

  return {
    props: {
      posts,
      categories,
    },
  };
}

export default Home;
