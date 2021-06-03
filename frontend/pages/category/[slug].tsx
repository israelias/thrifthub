import Link from 'next/link';
import { useRouter } from 'next/router';
import { GetStaticProps, GetStaticPaths } from 'next';

import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import CardMedia from '@material-ui/core/CardMedia';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import Layout from '../../components/Layout';
import Header from '../../components/Header';

import { Product, Category } from '../../interfaces';

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

const CategoryPage = ({ posts, categories }: Props) => {
  const classes = useStyles();
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

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

// This function gets called at build time
export const getStaticPaths: GetStaticPaths = async () => {
  // Call an external API endpoint to get posts
  const res = await fetch('http://127.0.0.1:8000/api/category');
  const posts = await res.json();

  // Get the paths we want to pre-render based on posts
  const paths = posts.map((post: Category) => ({
    params: { slug: post.slug },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const res = await fetch(
    `http://127.0.0.1:8000/api/category/${params.slug}`
  );
  const posts = await res.json();

  const ress = await fetch('http://127.0.0.1:8000/api/category/');
  const categories = await ress.json();

  return {
    props: {
      posts,
      categories,
    },
  };
};

export default CategoryPage;
