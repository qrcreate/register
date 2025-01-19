import { postJSON } from 'https://cdn.jsdelivr.net/gh/jscroot/lib@0.2.0/api.js';
import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/src/sweetalert2.js";
import {redirect} from "https://cdn.jsdelivr.net/gh/jscroot/lib@0.0.4/url.js";

function register() {
    console.log("Tombol daftar diklik"); // Debugging log
    const name = document.getElementById("nameInput").value.trim();
    const phone = document.getElementById("phoneInput").value.trim();
    const email = document.getElementById("emailInput").value.trim();

    // Cek apakah ada form yang kosong
    if (!name || !phone || !email ) {
        Swal.fire({
            icon: "error",
            title: "Form Belum Lengkap",
            text: "Isi semua kolom dulu, ya! Jangan ada yang kelewat.",
        });
        return;
    }

    // Validasi nomor telepon
    if (!validatePhone(phone)) {
        Swal.fire({
            icon: "error",
            title: "Nomor HP Gak Valid",
            text: "Pastikan nomor HP kamu bener, harus pake awalan 62, contohnya: 628XXXXXXXXX.",
        });
        return;
    }

    // Validasi email
    if (!validateEmail(email)) {
        Swal.fire({
            icon: "error",
            title: "Email Gak Valid",
            text: "Masukin email yang bener dong, pastikan formatnya kayak xxx@yyy.zzz.",
        });
        return;
    }

    const data = {
        name: name,
        phonenumber: phone,
        email: email,
    };

    const target_url = "https://asia-southeast2-qrcreate-447114.cloudfunctions.net/qrcreate/data/user";

    // Notifikasi loading saat proses pendaftaran
    Swal.fire({
        title: "Lagi daftar... Tunggu bentar ya!",
        html: "Sedang diproses, jangan khawatir.",
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });

    // Kirim data pendaftaran
    postJSON(
        target_url,
        "Content-Type",
        "application/json",
        data,
        (response) => {
            Swal.close();
            if (response.status >= 200 && response.status < 300) {
                Swal.fire({
                    icon: "success",
                    title: "Selamat Datang!",
                    html: `<b>Pendaftaran Berhasil!</b><br>Kamu akan diarahkan sebentar lagi.`,
                    timer: 3000,
                    timerProgressBar: true,
                    willClose: () => {
                        redirect("/login");
                    },
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Gagal Daftar",
                    text: response.data.message || "Ada yang salah, coba lagi ya.",
                });
            }
        },
        (error) => {
            Swal.close();
            Swal.fire({
                icon: "error",
                title: "Error Koneksi",
                text: "Gagal terhubung ke server. Cek koneksi kamu dan coba lagi.",
            });
        }
    );
}

// Fungsi validasi nomor HP
function validatePhone(phone) {
    const re = /^62[0-9]{9,13}$/; // Format yang valid untuk nomor Indonesia
    return re.test(phone);
}

// Fungsi validasi email
function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
}

// Attach Register Function to Button
document.getElementById("registerButton").addEventListener("click", register);
