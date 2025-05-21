const mysql = require('mysql2');
const {query} = require("express");

function createDatabaseIfNotExists(connection) {
    connection.query('CREATE DATABASE IF NOT EXISTS hotel', (error) => {
        if (error) throw error;
        console.log('Database "hotel" ready!');
    });
}

function createTablesIfNotExist(connection) {
    const staffTableQuery = `
        CREATE TABLE IF NOT EXISTS staff (
                                             id INT AUTO_INCREMENT PRIMARY KEY,
                                             StaffId VARCHAR(50) UNIQUE,
            name VARCHAR(100) NOT NULL,
            gender VARCHAR(10),
            position VARCHAR(50),
            role VARCHAR(50),
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(100) NOT NULL
            );
    `;

    const guestsTableQuery = `
        CREATE TABLE IF NOT EXISTS guests (
            id INT AUTO_INCREMENT PRIMARY KEY,
            GuestId VARCHAR(50) UNIQUE,
            firstName VARCHAR(100) NOT NULL,
            lastName VARCHAR(100) NOT NULL,
            gender VARCHAR(10) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL
        );
    `;

    const servicesTableQuery =`
        CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ServiceId VARCHAR(50) UNIQUE,
        ServiceName VARCHAR(100),
        price DECIMAL(10, 2),
        inCharge VARCHAR(50),
        FOREIGN KEY (inCharge) REFERENCES staff(StaffId)
    );
    `;

    const roomsTableQuery =`
        CREATE TABLE IF NOT EXISTS rooms (
        id INT AUTO_INCREMENT PRIMARY KEY,
        roomNumber VARCHAR(50) UNIQUE,
        type ENUM('Regular', 'Deluxe'),
        description VARCHAR(255),
        status ENUM('available', 'occupied')
    );
    `;

    const bookingsTableQuery =`
        CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        BookingId VARCHAR(50) UNIQUE,
        Status VARCHAR(50),
        GuestId VARCHAR(50),
        StaffId VARCHAR(50),
        roomNumber VARCHAR(50),
        checkInDate DATE,
        checkOutDate DATE,
        FOREIGN KEY (GuestId) REFERENCES guests(GuestId),
        FOREIGN KEY (StaffId) REFERENCES staff(StaffId),
        FOREIGN KEY (roomNumber) REFERENCES rooms(roomNumber)
    );
    `;

    const serviceRecordsTableQuery =`
        CREATE TABLE IF NOT EXISTS serviceRecords (
        id INT AUTO_INCREMENT PRIMARY KEY,
        RecordId VARCHAR(50) UNIQUE,
        amount DECIMAL(10, 2),
        date DATE,
        status VARCHAR(50),
        GuestId VARCHAR(50),
        StaffId VARCHAR(50),
        FOREIGN KEY (GuestId) REFERENCES guests(GuestId),
        FOREIGN KEY (StaffId) REFERENCES staff(StaffId)
    );
    `;

    const paymentTableQuery =`
        CREATE TABLE IF NOT EXISTS payment (
        id INT AUTO_INCREMENT PRIMARY KEY,
        amount DECIMAL(10, 2),
        paymentMethod VARCHAR(50),
        StaffId VARCHAR(50),
        itemId VARCHAR(50),
        FOREIGN KEY (StaffId) REFERENCES staff(StaffId)
);
    `;


    // Array to hold table creation queries for scalability
        const tableQueries = [
            { name: 'staff', query: staffTableQuery },
            { name: 'guests', query: guestsTableQuery },
            { name: 'services', query: servicesTableQuery },
            {name: "rooms",query: roomsTableQuery },
            { name: 'bookings', query: bookingsTableQuery },
            {name:"serviceRecords", query: serviceRecordsTableQuery },
            {name:"payments", query: paymentTableQuery }
        ];

        tableQueries.forEach(({ name, query }) => {
            connection.query(query, (error) => {
                if (error) throw error;
                console.log(`Table "${name}" ready!`);
        });
    });
}

module.exports = { createDatabaseIfNotExists, createTablesIfNotExist };
