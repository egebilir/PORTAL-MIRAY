-- Create users table for admin authentication
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
);

-- Create survey_responses table
CREATE TABLE IF NOT EXISTS survey_responses (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    cabin_number VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    first_cruise BOOLEAN,
    booking_rating INTEGER,
    checkin_rating INTEGER,
    cabin_rating INTEGER,
    public_areas_rating INTEGER,
    fb_rating INTEGER,
    buffet_rating INTEGER,
    general_service_rating INTEGER,
    excursions_rating INTEGER,
    price_rating INTEGER,
    recommend_rating INTEGER,
    bars_rating INTEGER,
    restaurant_rating INTEGER,
    entertainment_rating INTEGER,
    shows_rating INTEGER,
    music_rating INTEGER,
    kids_rating INTEGER,
    casino_rating INTEGER,
    spa_rating INTEGER,
    internet_rating INTEGER,
    port_rating INTEGER,
    reception_rating INTEGER,
    guide_rating INTEGER,
    dutyfree_rating INTEGER,
    housekeeping_rating INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create media table for storing images and other files
CREATE TABLE IF NOT EXISTS media (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size INTEGER NOT NULL,
    path VARCHAR(255) NOT NULL,
    uploaded_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create content table for storing dynamic content
CREATE TABLE IF NOT EXISTS content (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    last_modified_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- News items
CREATE TABLE news (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    is_published BOOLEAN DEFAULT true,
    publish_date TIMESTAMP WITH TIME ZONE
);

-- Calendar events
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Shore excursions
CREATE TABLE excursions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    price DECIMAL(10,2),
    duration INTEGER,
    max_participants INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
);

-- Shore excursion working hours
CREATE TABLE shorex_hours (
    id SERIAL PRIMARY KEY,
    day_of_week INTEGER NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Game center games
CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    color VARCHAR(7),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true
);

-- Game center working hours
CREATE TABLE game_center_hours (
    id SERIAL PRIMARY KEY,
    session_type VARCHAR(20) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Customer surveys
CREATE TABLE surveys (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    cabin_number VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    first_cruise BOOLEAN,
    booking_rating INTEGER,
    checkin_rating INTEGER,
    cabin_rating INTEGER,
    public_areas_rating INTEGER,
    fb_rating INTEGER,
    buffet_rating INTEGER,
    general_rating INTEGER,
    excursions_rating INTEGER,
    price_rating INTEGER,
    recommend_rating INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Survey activity ratings
CREATE TABLE survey_activity_ratings (
    id SERIAL PRIMARY KEY,
    survey_id INTEGER REFERENCES surveys(id),
    activity_type VARCHAR(50) NOT NULL,
    rating INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Survey crew ratings
CREATE TABLE survey_crew_ratings (
    id SERIAL PRIMARY KEY,
    survey_id INTEGER REFERENCES surveys(id),
    crew_type VARCHAR(50) NOT NULL,
    rating INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
); 