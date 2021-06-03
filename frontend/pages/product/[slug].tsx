import Head from 'next/head';
import { useRouter } from 'next/router';
import { GetStaticProps, GetStaticPaths } from 'next';

import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Hidden from '@material-ui/core/Hidden';

import Header from '../../components/Header';
import { Product, Category } from '../../interfaces';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(0),
    borderRadius: '0',
  },
  paperImagePreview: {
    paddingTop: 30,
  },
  paperImage: {
    padding: theme.spacing(0),
    borderRadius: '0',
    marginLeft: 25,
    ['@media (max-width:600px)']: {
      marginLeft: -20,
      marginRight: -20,
    },
  },
  paperRight: {
    padding: theme.spacing(0),
    borderRadius: '0',
    paddingLeft: 40,
    paddingTop: 30,
    ['@media (max-width:600px)']: {
      paddingLeft: 0,
      paddingTop: 10,
    },
  },
  img: {
    maxWidth: '100%',
  },
}));

type Props = {
  post: Product;
  categories: Category[];
};

function ProductPage({ post, categories }: Props) {
  const classes = useStyles();
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>{post.title}</title>
      </Head>
      <Header categories={categories} />
      <Container maxWidth="md">
        <Grid container spacing={0}>
          <Hidden only={['xs', 'sm']}>
            <Grid item sm={1}>
              <Paper
                className={classes.paperImagePreview}
                elevation={0}
              >
                {post.product_image.map((c) => (
                  <div key={c.id}>
                    <Paper
                      className={classes.paperImage}
                      elevation={0}
                    >
                      <img
                        src={post.product_image[0].image}
                        alt={post.product_image[0].alt_text}
                        className={classes.img}
                      />
                    </Paper>
                  </div>
                ))}
              </Paper>
            </Grid>
          </Hidden>
          <Grid item xs={12} sm={6}>
            <Paper className={classes.paperImage} elevation={0}>
              <img
                src={post.product_image[0].image}
                alt={post.product_image[0].alt_text}
                className={classes.img}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} sm={5}>
            <Paper className={classes.paperRight} elevation={0}>
              <Box component="h1" fontSize={18} fontWeight="400">
                {post.title}
              </Box>
              <Box component="p" fontSize={22} fontWeight="900" m={0}>
                £{post.regular_price}
              </Box>
              <Box component="p" m={0} fontSize={14}>
                Free Delivery & Returns (Ts&Cs apply)
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

// This function gets called at build time
export const getStaticPaths: GetStaticPaths = async () => {
  // Call an external API endpoint to get posts
  const res = await fetch('http://127.0.0.1:8000/api/');
  const posts = await res.json();

  // Get the paths we want to pre-render based on posts
  const paths = posts.map((post: Product) => ({
    params: { slug: post.slug },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
};

// This also gets called at build time
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const res = await fetch(`http://127.0.0.1:8000/api/${params.slug}`);
  const post = await res.json();

  const ress = await fetch('http://127.0.0.1:8000/api/category/');
  const categories = await ress.json();

  return {
    props: {
      post,
      categories,
    },
  };
};

export default ProductPage;
