const queries = {
  getMerchantReviewsByWebsite: (website) =>
    `SELECT 
    merchant_review.id, 
    merchant_review.rating, 
    merchant_review.title, 
    merchant_review.content, 
    merchant_review.order_id, 
    merchant_review.merchant_id, 
    merchant_review.job_id, 
    merchant_review.createdAt, 
    CAST(merchant_review.experience_date AS DATE) as experienceDate,
    userprofile.id as userid, 
    userprofile.first_name, 
    userprofile.last_name, 
    userprofile.level_account ,
    userprofile.profile_url,
    userprofile.nickName,
    (SELECT COUNT(*) FROM merchant_review WHERE merchant_review.user_id = userprofile.id) as Nbre, 
    (SELECT FORMAT(SUM(merchant_review.rating) / COUNT(*), 1)  
        FROM merchant_review 
        WHERE merchant_review.merchant_id = (SELECT u.id FROM merchant_profile as u WHERE u.website = '${website}' ) 
        AND merchant_review.status = 'published'
    ) as RM 
FROM 
    merchant_review 
    INNER JOIN userprofile ON merchant_review.user_id = userprofile.id
WHERE 
    merchant_review.merchant_id = (SELECT u.id FROM merchant_profile as u WHERE u.website = '${website}' ) 
    AND merchant_review.status = 'published' 
ORDER BY 
    merchant_review.createdAt DESC`,

  getProductReviewsByProduct_name: (product_name) => `SELECT product_review.id, 
       product_review.image_video,
       product_review.product_name,
       (SELECT products.aw_image_url 
        FROM products 
        WHERE products.product_name = '${product_name}') as product_image,
       product_review.rating, 
       product_review.title, 
       product_review.content, 
       product_review.order_id, 
       product_review.product_id, 
       product_review.job_id,
       product_review.createdAt, 
       CAST(product_review.experience_date AS DATE) as experienceDate,
       userprofile.id as userid, 
       userprofile.first_name, 
       userprofile.last_name, 
       userprofile.level_account,
       userprofile.profile_url,
       userprofile.nickName,
       (SELECT COUNT(*) 
        FROM product_review 
        WHERE product_review.user_id = userprofile.id) as Nbre, 
       (SELECT FORMAT(AVG(product_review.rating), 1) 
        FROM product_review 
        WHERE product_review.product_name = '${product_name}') as RM
FROM product_review 
INNER JOIN userprofile 
ON product_review.user_id = userprofile.id 
WHERE product_review.product_name = '${product_name}' AND product_review.status = 'published'
ORDER BY product_review.createdAt DESC
`,

  getProductReviewsByProduct_Id: (product_id) => `SELECT product_review.id, 
       product_review.image_video,
       product_review.product_name,
       (SELECT products.aw_image_url 
        FROM products 
        WHERE products.id = '${product_id}') as product_image,
       product_review.rating, 
       product_review.title, 
       product_review.content, 
        product_review.order_id, 
         product_review.product_id,
       product_review.job_id,
       product_review.createdAt,
       CAST(product_review.experience_date AS DATE) as experienceDate,
       userprofile.id as userid,  
       userprofile.first_name, 
       userprofile.last_name, 
       userprofile.level_account,
       userprofile.profile_url,
       userprofile.nickName,
       (SELECT COUNT(*) 
        FROM product_review 
        WHERE product_review.user_id = userprofile.id) as Nbre, 
       (SELECT FORMAT(AVG(product_review.rating), 1) 
        FROM product_review 
        WHERE product_review.product_id = '${product_id}') as RM
FROM product_review 
INNER JOIN userprofile 
ON product_review.user_id = userprofile.id 
WHERE product_review.product_id = '${product_id}' AND product_review.status = 'published'
ORDER BY product_review.createdAt DESC
`,

  getMerchantReviewsById: (id) =>
    `SELECT 
    merchant_review.id, 
    merchant_review.rating, 
    merchant_review.title, 
    merchant_review.content, 
    merchant_review.order_id, 
    merchant_review.merchant_id, 
      merchant_review.job_id,
     merchant_review.createdAt,
    CAST(merchant_review.experience_date AS DATE) as experienceDate,
      userprofile.id as userid, 
    userprofile.first_name, 
    userprofile.last_name, 
    userprofile.level_account ,
    userprofile.profile_url,
    userprofile.nickName,
    (SELECT COUNT(*) FROM merchant_review WHERE merchant_review.user_id = userprofile.id) as Nbre
FROM 
    merchant_review 
    INNER JOIN userprofile ON merchant_review.user_id = userprofile.id
WHERE 
    merchant_review.id = '${id}'  
    AND merchant_review.status = 'published' `,

  getProductReviewById: (id) => `SELECT product_review.id, 
       product_review.image_video,
       product_review.product_name,
       product_review.rating, 
       product_review.title, 
       product_review.content, 
        product_review.order_id,
         product_review.product_id,
           product_review.job_id,
        product_review.createdAt,
       CAST(product_review.experience_date AS DATE) as experienceDate,
         userprofile.id as userid, 
       userprofile.first_name, 
       userprofile.last_name, 
       userprofile.level_account,
       userprofile.profile_url,
       userprofile.nickName,
       (SELECT COUNT(*) 
        FROM product_review 
        WHERE product_review.user_id = userprofile.id) as Nbre
        FROM product_review 
        INNER JOIN userprofile 
        ON product_review.user_id = userprofile.id 
        WHERE product_review.id = '${id}' 
        AND product_review.status = 'published'
`,

  getProductReviewByOrderId: (OrderId) => `SELECT product_review.id, 
       product_review.image_video,
       product_review.product_name,
       product_review.rating, 
       product_review.title, 
       product_review.content, 
       product_review.order_id, 
        product_review.product_id,
          product_review.job_id,
         product_review.createdAt,
       CAST(product_review.experience_date AS DATE) as experienceDate
       
        FROM product_review 
    
        WHERE product_review.order_id = '${OrderId}' 
        AND product_review.status = 'published'
`,

  getSuggestionsUsersToFollow: (
    userId
  ) => `SELECT u.id, u.first_name, u.last_name, COUNT(DISTINCT mr.id) + COUNT(DISTINCT pr.id) AS total_reviews
FROM follow f
INNER JOIN userprofile u ON f.follower_userId = u.id
LEFT JOIN merchant_review mr ON f.follower_userId = mr.user_id
LEFT JOIN product_review pr ON f.follower_userId = pr.user_id
WHERE (f.following_userId  = ${userId} and f.status = '1') OR f.following_userId != ${userId}

AND f.follower_userId NOT IN (
  SELECT following_userId
  FROM follow
  WHERE follower_userId = ${userId} and status = '1'
)

GROUP BY u.id, u.first_name, u.last_name
ORDER BY total_reviews DESC;
`,

  getTopSuggestionsUsersToFollow: (
    userId
  ) => `SELECT u.id, u.first_name, u.last_name, r.num_reviews
FROM userprofile u
JOIN (
  SELECT user_id, COUNT(*) AS num_reviews
  FROM (
    SELECT user_id FROM product_review
    UNION ALL
    SELECT user_id FROM merchant_review
  ) AS reviews
  WHERE EXISTS (
    SELECT id FROM userprofile WHERE id = reviews.user_id
  )
  GROUP BY user_id
  ORDER BY num_reviews DESC
  LIMIT 10
) AS r ON u.id = r.user_id
WHERE u.id <> ${userId}
`,

  getLastReviewCaroussel: () => ` SELECT
    r.id,
    r.content,
    r.createdAt,
    r.rating,
    u.id as userid,
    u.first_name,
    u.last_name,
    u.profile_url,
    COALESCE(p.product_name, m.name) AS item_name,
    COALESCE(p.id, m.id) AS item_id,
    COALESCE(p.product_name, m.website) AS item_url
FROM
    (
        SELECT
            id,
            content,
            createdAt,
            rating,
            status,
            user_id,
            NULL AS product_id,
            merchant_id
        FROM
            merchant_review
        UNION ALL
        SELECT
            id,
            content,
            createdAt,
            rating,
            status,
            user_id,
            product_id,
            NULL AS merchant_id
        FROM
            product_review
    ) AS r
INNER JOIN userprofile AS u ON r.user_id = u.id
LEFT JOIN products AS p ON r.product_id = p.id
LEFT JOIN merchant_profile AS m ON r.merchant_id = m.id
WHERE r.status = 'published'
ORDER BY
    r.createdAt DESC
LIMIT 24;`,

  getFollowingsFilteredByName: (
    userId,
    queryname
  ) => `SELECT u.id, u.nickname, u.first_name, u.last_name
FROM follow f 
INNER JOIN userprofile u ON f.following_userId = u.id 
WHERE f.follower_userId = ${userId} AND (u.nickname LIKE '${queryname}%' OR u.first_name LIKE '${queryname}%');
`,

  getFollowersFilteredByName: (
    userId,
    queryname
  ) => `SELECT u.id, u.nickname, u.first_name, u.last_name
FROM follow f 
INNER JOIN userprofile u ON f.follower_userId = u.id 
WHERE f.following_userId = ${userId} AND (u.nickname LIKE '${queryname}%' OR u.first_name LIKE '${queryname}%');
`,

  getProductsMerchantprofileByCategorie: (
    categorie_name
  ) => `WITH RECURSIVE mainCat AS (
  SELECT
    parent.google_category_id AS id,
    parent.vt_category AS name,
    parent.category_parent_id AS parent_category_id,
    parent.vt_category AS direct_parent_name,
    parent.vt_category AS route,
    0 AS level
  FROM
    vt_categories AS parent
  WHERE
    parent.category_parent_id IS NULL
  GROUP BY
    parent.vt_category
  
  UNION ALL
  
  SELECT
    children.google_category_id AS id,
    children.category_name AS name,
    children.category_parent_id AS parent_category_id,
    mainCat.name AS direct_parent_name,
    CONCAT(mainCat.route, '-', children.category_name),
    mainCat.level + 1 AS level
  FROM
    mainCat
  INNER JOIN
    vt_categories AS children
  ON
    mainCat.id = children.category_parent_id
)

SELECT
  p.id,
  p.product_name,
  p.category_name,
  p.aw_image_url,
  'product' as 'type',
  p.ReviewsNumber,
  p.ReviewMean
FROM
  products AS p
WHERE
  p.category_name IN (
    SELECT name FROM mainCat WHERE name = '${categorie_name}' OR route LIKE '${categorie_name}-%'
  )

UNION ALL

SELECT
  m.id,
  m.website,
  m.category_1,
  m.logo,
  'merchant' as 'type',
  m.ReviewsNumber,
  m.ReviewMean
FROM
  merchant_profile AS m
WHERE
  m.category_1 IN (
    SELECT name FROM mainCat WHERE name = '${categorie_name}' OR route LIKE '${categorie_name}-%'
  )
  OR m.category_2 IN (
    SELECT name FROM mainCat WHERE name = '${categorie_name}' OR route LIKE '${categorie_name}-%'
  )
  OR m.category_3 IN (
    SELECT name FROM mainCat WHERE name = '${categorie_name}' OR route LIKE '${categorie_name}-%'
  );`,
};

module.exports = queries;
