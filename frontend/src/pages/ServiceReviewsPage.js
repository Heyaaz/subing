import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getReviewsByService, getServiceRating, deleteReview, checkUserReviewed } from '../services/reviewService';
import { getServiceById } from '../services/serviceService';
import StarRating from '../components/StarRating';
import ReviewModal from '../components/ReviewModal';

const ServiceReviewsPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [hasReviewed, setHasReviewed] = useState(false);
  const currentUserId = parseInt(localStorage.getItem('userId'));

  useEffect(() => {
    fetchData();
  }, [serviceId]);

  const fetchData = async () => {
    try {
      const [serviceData, reviewsData, ratingData, hasReviewedData] = await Promise.all([
        getServiceById(serviceId),
        getReviewsByService(serviceId),
        getServiceRating(serviceId),
        checkUserReviewed(serviceId),
      ]);

      setService(serviceData);
      setReviews(reviewsData);
      setRating(ratingData);
      setHasReviewed(hasReviewedData);
    } catch (error) {
      console.error('데이터 조회 실패:', error);
      alert('데이터를 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleWriteReview = () => {
    setEditingReview(null);
    setShowModal(true);
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowModal(true);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await deleteReview(reviewId);
      alert('리뷰가 삭제되었습니다.');
      fetchData();
    } catch (error) {
      console.error('리뷰 삭제 실패:', error);
      alert('리뷰 삭제에 실패했습니다.');
    }
  };

  const handleSuccess = () => {
    fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800 mb-4"
          >
            ← 뒤로가기
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{service?.name}</h1>
              <p className="mt-2 text-sm text-gray-600">{service?.description}</p>
            </div>
            {!hasReviewed && (
              <button
                onClick={handleWriteReview}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                리뷰 작성
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 평균 평점 */}
        {rating && rating.reviewCount > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">평균 평점</h2>
            <StarRating
              rating={rating.averageRating}
              reviewCount={rating.reviewCount}
              size="lg"
            />
          </div>
        )}

        {/* 리뷰 목록 */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              리뷰 ({reviews.length})
            </h2>
          </div>

          {reviews.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              아직 작성된 리뷰가 없습니다.
              {!hasReviewed && (
                <button
                  onClick={handleWriteReview}
                  className="block mx-auto mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  첫 리뷰 작성하기
                </button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {reviews.map((review) => (
                <div key={review.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-gray-900">
                          {review.userName}
                        </span>
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                      {review.content && (
                        <p className="text-gray-700 mt-2 whitespace-pre-wrap">
                          {review.content}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(review.createdAt).toLocaleDateString('ko-KR')}
                        {review.createdAt !== review.updatedAt && ' (수정됨)'}
                      </p>
                    </div>

                    {review.userId === currentUserId && (
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handleEditReview(review)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 리뷰 작성/수정 모달 */}
      <ReviewModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        serviceId={parseInt(serviceId)}
        serviceName={service?.name}
        existingReview={editingReview}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default ServiceReviewsPage;