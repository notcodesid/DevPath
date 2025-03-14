import { ImageResponse } from '@vercel/og';


export const runtime = 'edge';
export const contentType = 'image/png';
export const size = { width: 1200, height: 630 };

export default async function Image({ params }: { params: { shareId: string } }) {
  const shareId = params.shareId;
  let title = 'DevPath Learning Path';
  
  try {
    // Fetch the learning path data
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/shared-path/${shareId}`);
    if (response.ok) {
      const data = await response.json();
      if (data.path && data.path.title) {
        title = data.path.title;
      }
    }
  } catch (error) {
    console.error('Error fetching path for OG image:', error);
  }
  
  // Truncate title if it's too long
  const displayTitle = title.length > 70 ? `${title.substring(0, 67)}...` : title;
  
  // Font size adjustment based on title length
  const fontSize = displayTitle.length > 50 ? '40px' : '48px';
  
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          backgroundColor: '#151718',
          padding: '40px 50px',
          position: 'relative',
        }}
      >
        {/* Logo and branding */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '30px',
          }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 3C15.5523 3 16 3.44772 16 4V5H20C20.5523 5 21 5.44772 21 6V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V6C3 5.44772 3.44772 5 4 5H8V4C8 3.44772 8.44772 3 9 3H15ZM14 5H10V4H14V5ZM9 9C9 8.44772 8.55228 8 8 8C7.44772 8 7 8.44772 7 9C7 9.55228 7.44772 10 8 10C8.55228 10 9 9.55228 9 9ZM8 12C8.55228 12 9 12.4477 9 13C9 13.5523 8.55228 14 8 14C7.44772 14 7 13.5523 7 13C7 12.4477 7.44772 12 8 12ZM8 16C8.55228 16 9 16.4477 9 17C9 17.5523 8.55228 18 8 18C7.44772 18 7 17.5523 7 17C7 16.4477 7.44772 16 8 16ZM12 8C11.4477 8 11 8.44772 11 9C11 9.55228 11.4477 10 12 10H16C16.5523 10 17 9.55228 17 9C17 8.44772 16.5523 8 16 8H12ZM12 12C11.4477 12 11 12.4477 11 13C11 13.5523 11.4477 14 12 14H16C16.5523 14 17 13.5523 17 13C17 12.4477 16.5523 12 16 12H12ZM12 16C11.4477 16 11 16.4477 11 17C11 17.5523 11.4477 18 12 18H16C16.5523 18 17 17.5523 17 17C17 16.4477 16.5523 16 16 16H12Z" fill="#dbdbd9"/>
          </svg>
          <span
            style={{
              marginLeft: '10px',
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#dbdbd9',
            }}
          >
            DevPath
          </span>
        </div>
        
        {/* Title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <h1
            style={{
              fontSize,
              fontWeight: 'bold',
              color: '#dbdbd9',
              margin: '0',
              lineHeight: '1.2',
              maxWidth: '800px',
            }}
          >
            {displayTitle}
          </h1>
          <p
            style={{
              fontSize: '24px',
              color: '#dbdbd9',
              opacity: 0.8,
              marginTop: '20px',
            }}
          >
            A personalized learning path for your development journey
          </p>
        </div>
        
        {/* Bottom gradient */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '100px',
            background: 'linear-gradient(to top, rgba(21, 23, 24, 0.8), transparent)',
          }}
        />
      </div>
    ),
    {
      ...size,
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=30',
      },
    },
  );
} 