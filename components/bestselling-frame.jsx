import React from 'react';

const BestSellingFrame = () => {
  const styles = {
    wrapper: {
      width: '100%',
    },
    imageTopHeader: {
      position: 'absolute',
      top: '30px', // Adjust vertically within the image
      left: '50%',
      transform: 'translateX(-50%)',
      textAlign: 'center',
      fontSize: '20px',
      fontWeight: '500',
      color: '#fff',
      maxWidth: '90%',
      lineHeight: '1.5',
      zIndex: 2,
    },
    topHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      marginBottom: '10px',
      padding: '20px 0',
    },
    line: {
      flex: 1,
      height: '1px',
      backgroundColor: '#172554',
      margin: '0 20px',
    },
    headerText: {
      fontSize: '26px',
      fontWeight: 'bold',
      color: '#172554',
      whiteSpace: 'nowrap',
    },
    container: {
      width: '100%',
      height: '80vh',
      backgroundImage: 'url(/images/banner/bestsellingframe.jpg)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      position: 'relative',
      color: '#fff',
    },
    overlayContent: {
      position: 'absolute',
      top: '50%',
      left: '0',
      right: '0',
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0 40px',
      transform: 'translateY(-50%)',
    },
    inlineHeader: {
      fontSize: '20px',
      fontWeight: '600',
    },
    inlineHeaderLeft: {
      marginLeft: '450px',
      fontSize: '32px',        // Adjust the size as needed
      fontWeight: '600',
      lineHeight: '1.2',
      maxWidth: '350px',       // Controls when the line breaks

      alignText: 'center',
    },
    inlineHeaderRight: {
      marginRight: '450px',
      fontSize: '32px',        // Adjust the size as needed
      fontWeight: '600',
      lineHeight: '1.2',
      maxWidth: '300px',       // Controls when the line breaks
      wordBreak: 'break-word'
    },
    buttonWrapper: {
      position: 'absolute',
      bottom: '30px',
      left: '0',
      right: '0',
      display: 'flex',
      justifyContent: 'center',
    },
    link: {
      padding: '12px 28px',
      backgroundColor: '#172554',
      color: '#fff',
      textDecoration: 'none',
      fontSize: '18px',
      borderRadius: '6px',
    },
  };

  return (
    <div style={styles.wrapper}>
      {/* Top Header OUTSIDE the image */}
      <div style={styles.topHeader}>
        <div style={styles.line}></div>
        <div style={styles.headerText}>Best Selling Frame</div>
        <div style={styles.line}></div>
      </div>

      {/* Image Background Section */}
      <div style={styles.container}>
        {/* Inline headers inside the image */}
        <div style={styles.imageTopHeader}>
          Where timeless design meets unbeatable demand —<br />
          our best-selling frame isn’t just worn, it’s chosen by thousands every day.
        </div>
        <div style={styles.overlayContent}>

          <div style={{
            textAlign: 'center',
            fontSize: '32px',
            fontWeight: '600',
            lineHeight: '1.3',
            
            marginLeft: '350px',
            color: '#fff',
            position: 'relative',
          }}>
            <span style={{ fontSize: '60px', color: '#ccc' }}>&ldquo;</span>
            Bestseller by
            choice,<br /> not chance
            <span style={{ fontSize: '60px', color: '#ccc' }}>&rdquo;</span>
          </div>
          <div style={{
            textAlign: 'center',
            fontSize: '32px',
            fontWeight: '600',
            lineHeight: '1.3',
            marginRight: '375px',
            
            color: '#fff',
            position: 'relative',
          }}>
            <span style={{ fontSize: '60px', color: '#ccc' }}>&ldquo;</span>
            Crafted to stand out,<br />
            built to fit all.
            <span style={{ fontSize: '60px', color: '#ccc' }}>&rdquo;</span>
          </div>
        </div>

        {/* Bottom Button */}
        <div style={styles.buttonWrapper}>
          <a href="/shop" style={styles.link}>Find Nearby Shop</a>
        </div>
      </div>
    </div>
  );
};

export default BestSellingFrame;
