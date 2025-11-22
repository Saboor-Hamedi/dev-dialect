-- Turn off RLS temporarily to confirm it works
ALTER TABLE posts DISABLE ROW LEVEL SECURITY;

Error creating post: duplicate key value violates unique constraint "posts_pkey"
SELECT setval('posts_id_seq', (SELECT MAX(id) FROM posts) + 1, false);
