---
published: true
title: "golang - entgo"
categories:
  - GoLang
tags:
  - [golang, ent]
toc: true
toc_sticky: true
date: "2022-11-14 12:00"
---

### Go Ent

정리중인 자료입니다.

#### edge

```go
// Edges of the Post.
func (Post) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("user", User.Type).
			Ref("posts").
			Unique(),
	}
}

// Edges of the User.
func (User) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("posts", Post.Type),
	}
}

```

#### Join

user(1) : post(N) 의 관계 ent mapping 시 데이터 디버그

```go
	// [QUERY]
	post, err := database.Ent.Debug().User.
		Query().
		QueryPosts().
		Where(post.ID(id)).
		WithUser().
		Only(ctx)

	// 두번 실행 됌
	// SELECT DISTINCT 
	// `posts`.`id`, 
	// `posts`.`title`,
	// `posts`.`body`,
	// `posts`.`tags`,
	// `posts`.`publish_at`,
	// `posts`.`user_posts`
	// FROM `posts` JOIN (SELECT `users`.`id` FROM `users`) 
	// AS `t1` ON `posts`.`user_posts` = `t1`.`id` WHERE `posts`.`id` = ? LIMIT 2 args=[16

	// SELECT DISTINCT 
	// `users`.`id`, 
	// `users`.`email`, 
	// `users`.`username`, 
	// `users`.`password`, 
	// `users`.`create_at`, 
	// `users`.`update_at` 
	// FROM `users` 
	// WHERE `users`.`id` IN (?) args=[1]

	// [Result]
	// Post(
	// id=16,
	// title=test16,
	// body=body입니다123123,
	// tags=[tag1 tag2],
	// publishAt=Wed Oct 19 00:50:47 2022)
	log.Println(p)
	
	// User(
	// id=1, 
	// email=kyh0703@nate.com,
	// username=kimyeonho,
	// createAt=Fri Oct 14 02:24:37 2022,
	// updateAt=Fri Oct 14 02:24:37 2022)
	log.Println(p.Edges)

	// posts.Edges는 WithUser를 통해야지만 데이터가 들어가있음.
```

